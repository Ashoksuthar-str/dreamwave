'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Plus, Package, AlertCircle, Check, X } from 'lucide-react';
import axios from 'axios';

export default function TransfersPage() {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [transfers, setTransfers] = useState([]);
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [loadingTransfers, setLoadingTransfers] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedTransfer, setSelectedTransfer] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [formData, setFormData] = useState({
    fromWarehouseId: '',
    toWarehouseId: '',
    items: [],
  });
  const [currentItem, setCurrentItem] = useState({
    productId: '',
    quantity: '',
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [validationData, setValidationData] = useState({});

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchTransfers();
      fetchProducts();
      fetchWarehouses();
      fetchStocks();
    }
  }, [isAuthenticated]);

  const fetchTransfers = async () => {
    try {
      setLoadingTransfers(true);
      const response = await axios.get('/api/transfer');
      setTransfers(response.data.transfers || []);
    } catch (error) {
      console.error('Error fetching transfers:', error);
      setMessage({ type: 'error', text: 'Failed to fetch transfers' });
    } finally {
      setLoadingTransfers(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/product');
      setProducts(response.data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchWarehouses = async () => {
    try {
      const response = await axios.get('/api/warehouse');
      setWarehouses(response.data.warehouses || []);
    } catch (error) {
      console.error('Error fetching warehouses:', error);
    }
  };

  const fetchStocks = async () => {
    try {
      const response = await axios.get('/api/product');
      const allStocks = [];
      if (response.data.products) {
        response.data.products.forEach(product => {
          if (product.stocks) {
            product.stocks.forEach(stock => {
              allStocks.push({
                ...stock,
                productId: product.id,
                productName: product.name,
                productSku: product.sku,
              });
            });
          }
        });
      }
      setStocks(allStocks);
    } catch (error) {
      console.error('Error fetching stocks:', error);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (e) => {
    const { name, value } = e.target;
    setCurrentItem(prev => ({ ...prev, [name]: value }));
  };

  const getAvailableStock = () => {
    if (!currentItem.productId || !formData.fromWarehouseId) return 0;
    const stock = stocks.find(
      s => s.productId === Number(currentItem.productId) && s.warehouseId === Number(formData.fromWarehouseId)
    );
    return stock ? stock.quantity : 0;
  };

  const addItemToTransfer = () => {
    if (!currentItem.productId || !currentItem.quantity) {
      setMessage({ type: 'error', text: 'Please select product and quantity' });
      return;
    }

    if (!formData.fromWarehouseId || !formData.toWarehouseId) {
      setMessage({ type: 'error', text: 'Please select both source and destination warehouses' });
      return;
    }

    const availableStock = getAvailableStock();
    if (Number(currentItem.quantity) > availableStock) {
      setMessage({ type: 'error', text: `Only ${availableStock} units available` });
      return;
    }

    const product = products.find(p => p.id === Number(currentItem.productId));

    setFormData(prev => ({
      ...prev,
      items: [
        ...prev.items,
        {
          productId: Number(currentItem.productId),
          productName: product?.name,
          productSku: product?.sku,
          quantity: Number(currentItem.quantity),
        },
      ],
    }));
    setCurrentItem({ productId: '', quantity: '' });
    setMessage({ type: '', text: '' });
  };

  const removeItemFromTransfer = (index) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (!formData.fromWarehouseId || !formData.toWarehouseId || formData.items.length === 0) {
      setMessage({ type: 'error', text: 'Please fill warehouses and add items' });
      return;
    }

    if (formData.fromWarehouseId === formData.toWarehouseId) {
      setMessage({ type: 'error', text: 'Source and destination must be different' });
      return;
    }

    try {
      const payload = {
        fromWarehouseId: Number(formData.fromWarehouseId),
        toWarehouseId: Number(formData.toWarehouseId),
        items: formData.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      };

      await axios.post('/api/transfer', payload);
      setMessage({ type: 'success', text: 'Transfer created successfully' });

      setTimeout(() => {
        setFormData({
          fromWarehouseId: '',
          toWarehouseId: '',
          items: [],
        });
        setShowForm(false);
        fetchTransfers();
      }, 1000);
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to create transfer';
      setMessage({ type: 'error', text: errorMsg });
    }
  };

  const handleCompleteTransfer = async (transfer) => {
    setSelectedTransfer(transfer);
    setValidationData(
      transfer.items.reduce((acc, item) => {
        acc[item.id] = 0;
        return acc;
      }, {})
    );
    setShowDetailsModal(true);
  };

  const handleValidationChange = (transferItemId, value) => {
    setValidationData(prev => ({
      ...prev,
      [transferItemId]: Math.max(0, Number(value)),
    }));
  };

  const submitCompletion = async () => {
    if (!selectedTransfer) return;

    try {
      const items = selectedTransfer.items.map(item => ({
        transferItemId: item.id,
        transferredQty: validationData[item.id] || 0,
      }));

      await axios.patch('/api/transfer', {
        transferId: selectedTransfer.id,
        status: 'completed',
        items,
      });

      setMessage({ type: 'success', text: 'Transfer completed and stock updated' });
      setShowDetailsModal(false);
      setSelectedTransfer(null);
      setValidationData({});
      fetchTransfers();
      fetchStocks();
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to complete transfer';
      setMessage({ type: 'error', text: errorMsg });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#24253A] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#24253A] text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2">Internal Transfers</h1>
            <p className="text-gray-400">Transfer products between warehouses</p>
          </div>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-[#b976ff] to-[#7864EF] text-white font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-all flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              New Transfer
            </button>
          )}
        </div>

        {message.text && (
          <div
            className={`mb-6 p-4 rounded-lg border ${
              message.type === 'success'
                ? 'bg-green-50 border-green-200 text-green-700'
                : 'bg-[#402040] border-[#b976ff] text-[#ff297a]'
            }`}
          >
            {message.text}
          </div>
        )}

        {showForm && (
          <div className="bg-[#292b3b] rounded-lg border border-gray-800 p-6 mb-8">
            <h2 className="text-2xl font-bold mb-6">Create New Transfer</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 text-sm mb-2 font-medium">
                    From Warehouse *
                  </label>
                  <select
                    name="fromWarehouseId"
                    value={formData.fromWarehouseId}
                    onChange={handleFormChange}
                    required
                    className="w-full bg-[#24253A] border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-[#b976ff] outline-none"
                  >
                    <option value="">Select source warehouse</option>
                    {warehouses.map(warehouse => (
                      <option key={warehouse.id} value={warehouse.id}>
                        {warehouse.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 text-sm mb-2 font-medium">
                    To Warehouse *
                  </label>
                  <select
                    name="toWarehouseId"
                    value={formData.toWarehouseId}
                    onChange={handleFormChange}
                    required
                    className="w-full bg-[#24253A] border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-[#b976ff] outline-none"
                  >
                    <option value="">Select destination warehouse</option>
                    {warehouses.map(warehouse => (
                      <option key={warehouse.id} value={warehouse.id}>
                        {warehouse.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="border-t border-gray-700 pt-6">
                <h3 className="text-lg font-semibold mb-4">Add Products</h3>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-300 text-sm mb-2 font-medium">
                      Product
                    </label>
                    <select
                      name="productId"
                      value={currentItem.productId}
                      onChange={handleItemChange}
                      className="w-full bg-[#24253A] border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-[#b976ff] outline-none"
                    >
                      <option value="">Select product</option>
                      {products.map(product => (
                        <option key={product.id} value={product.id}>
                          {product.name} ({product.sku})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm mb-2 font-medium">
                      Available
                    </label>
                    <div className="w-full bg-[#24253A] border border-gray-700 rounded-lg px-3 py-2 text-gray-400">
                      {getAvailableStock()} units
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm mb-2 font-medium">
                      Quantity
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      value={currentItem.quantity}
                      onChange={handleItemChange}
                      min="1"
                      max={getAvailableStock()}
                      className="w-full bg-[#24253A] border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-[#b976ff] outline-none"
                      placeholder="0"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={addItemToTransfer}
                      className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700 transition-all"
                    >
                      Add Item
                    </button>
                  </div>
                </div>

                {formData.items.length > 0 && (
                  <div className="bg-[#24253A] rounded-lg p-4">
                    <h4 className="font-semibold mb-3">Items to Transfer:</h4>
                    <div className="space-y-2">
                      {formData.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-[#1f2529] rounded">
                          <div>
                            <p className="font-medium">{item.productName}</p>
                            <p className="text-xs text-gray-400">{item.productSku} - Qty: {item.quantity}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeItemFromTransfer(index)}
                            className="p-2 text-red-400 hover:bg-red-500 hover:bg-opacity-20 rounded"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-[#b976ff] to-[#7864EF] text-white font-bold py-2 rounded-lg hover:opacity-90 transition-all"
                >
                  Create Transfer
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setFormData({
                      fromWarehouseId: '',
                      toWarehouseId: '',
                      items: [],
                    });
                    setCurrentItem({ productId: '', quantity: '' });
                    setMessage({ type: '', text: '' });
                  }}
                  className="flex-1 bg-[#24253A] border border-gray-700 text-gray-300 font-bold py-2 rounded-lg hover:bg-[#2d2f3b] transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-[#292b3b] rounded-lg border border-gray-800 overflow-hidden">
          <div className="p-6 border-b border-gray-800">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Package className="w-6 h-6" />
              Transfers List
            </h2>
          </div>

          {loadingTransfers ? (
            <div className="p-6 text-center text-gray-400">Loading transfers...</div>
          ) : transfers.length === 0 ? (
            <div className="p-6 text-center">
              <AlertCircle className="w-12 h-12 text-gray-500 mx-auto mb-2 opacity-50" />
              <p className="text-gray-400">No transfers found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#24253A] border-b border-gray-700">
                  <tr>
                    <th className="px-6 py-3 font-semibold text-gray-300">From</th>
                    <th className="px-6 py-3 font-semibold text-gray-300">To</th>
                    <th className="px-6 py-3 font-semibold text-gray-300">Items</th>
                    <th className="px-6 py-3 font-semibold text-gray-300">Date</th>
                    <th className="px-6 py-3 font-semibold text-gray-300">Status</th>
                    <th className="px-6 py-3 font-semibold text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {transfers.map(transfer => (
                    <tr key={transfer.id} className="border-b border-gray-800 hover:bg-[#24253A] transition-colors">
                      <td className="px-6 py-4">{transfer.fromWarehouse?.name || '-'}</td>
                      <td className="px-6 py-4">{transfer.toWarehouse?.name || '-'}</td>
                      <td className="px-6 py-4">{transfer.items?.length || 0}</td>
                      <td className="px-6 py-4">{new Date(transfer.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            transfer.status === 'completed'
                              ? 'bg-green-500 bg-opacity-20 text-green-400'
                              : 'bg-yellow-500 bg-opacity-20 text-yellow-400'
                          }`}
                        >
                          {transfer.status.charAt(0).toUpperCase() + transfer.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {transfer.status === 'draft' && (
                          <button
                            onClick={() => handleCompleteTransfer(transfer)}
                            className="p-2 text-green-400 hover:bg-green-500 hover:bg-opacity-20 rounded-lg transition-colors"
                            title="Complete"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {showDetailsModal && selectedTransfer && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-[#292b3b] rounded-lg border border-gray-800 p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h3 className="text-2xl font-bold mb-6">Complete Transfer #{selectedTransfer.id}</h3>

              <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-gray-700">
                <div>
                  <p className="text-gray-400 text-sm">From Warehouse</p>
                  <p className="font-semibold">{selectedTransfer.fromWarehouse?.name}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">To Warehouse</p>
                  <p className="font-semibold">{selectedTransfer.toWarehouse?.name}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Date</p>
                  <p className="font-semibold">{new Date(selectedTransfer.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Status</p>
                  <p className="font-semibold capitalize">{selectedTransfer.status}</p>
                </div>
              </div>

              <h4 className="font-semibold mb-4">Items to Transfer:</h4>
              <div className="space-y-4 mb-6">
                {selectedTransfer.items.map(item => (
                  <div key={item.id} className="bg-[#24253A] p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-semibold">{item.product?.name}</p>
                        <p className="text-xs text-gray-400">{item.product?.sku}</p>
                      </div>
                      <p className="text-sm text-gray-400">Qty to transfer: {item.quantity}</p>
                    </div>
                    <input
                      type="number"
                      value={validationData[item.id] || 0}
                      onChange={(e) => handleValidationChange(item.id, e.target.value)}
                      min="0"
                      max={item.quantity}
                      className="w-full bg-[#1f2529] border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-[#b976ff] outline-none"
                      placeholder="Enter transferred quantity"
                    />
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={submitCompletion}
                  className="flex-1 bg-gradient-to-r from-[#b976ff] to-[#7864EF] text-white font-bold py-2 rounded-lg hover:opacity-90 transition-all"
                >
                  Complete Transfer
                </button>
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedTransfer(null);
                    setValidationData({});
                  }}
                  className="flex-1 bg-[#24253A] border border-gray-700 text-gray-300 font-bold py-2 rounded-lg hover:bg-[#2d2f3b] transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
