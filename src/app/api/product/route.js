import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req) {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        stocks: true,
      },
      orderBy: {
        id: "desc",
      },
    });

    return NextResponse.json(
      { message: "Products fetched successfully", products },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get Products Error:", error);
    return NextResponse.json(
      { message: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "Product ID is required" },
        { status: 400 }
      );
    }

    const productId = Number(id);

    await prisma.$transaction([
      prisma.stock.deleteMany({
        where: { productId },
      }),
      prisma.receiptItem.deleteMany({
        where: { productId },
      }),
      prisma.deliveryItem.deleteMany({
        where: { productId },
      }),
      prisma.transferItem.deleteMany({
        where: { productId },
      }),
      prisma.product.delete({
        where: { id: productId },
      }),
    ]);

    return NextResponse.json(
      { message: "Product deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete Product Error:", error);
    return NextResponse.json(
      { message: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
