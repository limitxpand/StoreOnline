import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const setting = await prisma.setting.findUnique({
    where: { id: 'global' }
  });
  
  if (setting && setting.data) {
    let val: any = setting.data;
    
    // Migrate old format to new format
    if (val.payment && val.payment.adminWalletAddress !== undefined) {
      val.payment.paymentMethods = [
        {
          id: "default-sc-bep20",
          type: "smart_contract",
          network: "BEP20",
          address: val.payment.adminWalletAddress || "",
          currency: "USDT"
        }
      ];
      delete val.payment.adminWalletAddress;
      delete val.payment.cryptoCurrency;
      
      await prisma.setting.update({
        where: { id: 'global' },
        data: { data: val }
      });
      console.log("Migrated payment settings in DB.");
    }
  }
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
