import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { order } = req.body;

  let orderSummary = "";
  let subtotal = 0;

  for (let item in order) {
    orderSummary += `${item} x${order[item].qty} - $${(
      order[item].price * order[item].qty
    ).toFixed(2)}\n`;
    subtotal += order[item].price * order[item].qty;
  }

  const tax = subtotal * 0.06;
  const gratuity = subtotal * 0.2;
  const grandTotal = subtotal + tax + gratuity;

  const emailContent = `
    New Order Received:
    ---------------------------
    ${orderSummary}
    ---------------------------
    Subtotal: $${subtotal.toFixed(2)}
    Gratuity (20%): $${gratuity.toFixed(2)}
    Tax (6%): $${tax.toFixed(2)}
    Grand Total: $${grandTotal.toFixed(2)}
  `;

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "your-email@gmail.com",
      pass: "your-password",
    },
  });

  await transporter.sendMail({
    from: "your-email@gmail.com",
    to: "blendar.h.kabashi@gmail.com",
    subject: "New Food Order",
    text: emailContent,
  });

  res.status(200).json({ message: "Order sent successfully" });
}
