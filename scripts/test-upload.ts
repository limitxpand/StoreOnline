import { prisma } from '../lib/prisma';

async function main() {
  let user = await prisma.user.findFirst();
  if (!user) {
    user = await prisma.user.create({
      data: { name: 'Test Contributor', email: 'test@contributor.com', password: 'password', role: 'contributor' }
    });
  }

  if (!user) {
    console.error("No contributor user found. Cannot upload test product.");
    return;
  }

  let category = await prisma.category.findUnique({
    where: { slug: 'mt5-ea' }
  });

  if (!category) {
    category = await prisma.category.create({
      data: {
        name: 'MT5 Expert Advisor',
        slug: 'mt5-ea',
        platform: 'MT5'
      }
    });
  }

  const product = await prisma.product.create({
    data: {
      title: 'Top Bottom Quant',
      description: 'Test product from the Test product/Seller directory. An MT5 Expert Advisor.',
      price: 149.00,
      platform: 'MT5',
      status: 'pending',
      logoUrl: '/uploads/logos/logo_test.png',
      sourceFileUrl: '/uploads/source/src_test.mq5',
      developerId: user.id,
      categoryId: category.id,
    }
  });

  console.log("Successfully uploaded test product!", product);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
