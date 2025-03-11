export const sendOrderEmail = async (user, cart, totals) => {
  try {
    const response = await fetch("/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: user.email,
        subject: "Your Food Order Confirmation",
        html: `
          <div style="background-color: white; padding: 24px; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 14px; color: black;">
            <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 16px;">Order Confirmation</h1>
            
            <div style="margin-bottom: 24px;">
              <div>Full Name: ${user.fullName}</div>
              <div>Email: ${user.email}</div>
              <div>Phone number: ${user.phone}</div>
            </div>

            ${cart
              .map(
                (item) => `
              <div style="margin-bottom: 8px;">
                <span>${item.name} x${item.quantity}</span>
                <span style="float: right">$${(
                  item.price * item.quantity
                ).toFixed(2)}</span>
              </div>
            `
              )
              .join("")}

            <hr style="margin: 16px 0; border-color: #e5e7eb;" />
            
            <div style="margin-bottom: 8px;">
              <span>Subtotal:</span>
              <span style="float: right">$${totals.subtotal.toFixed(2)}</span>
            </div>
            <div style="margin-bottom: 8px;">
              <span>Gratuity (20%):</span>
              <span style="float: right">$${totals.gratuity.toFixed(2)}</span>
            </div>
            <div style="margin-bottom: 8px;">
              <span>Tax (6%):</span>
              <span style="float: right">$${totals.tax.toFixed(2)}</span>
            </div>

            <hr style="margin: 16px 0; border-color: #e5e7eb;" />
            
            <div style="font-size: 18px; font-weight: bold;">
              <span>Grand Total:</span>
              <span style="float: right">$${totals.grandTotal.toFixed(2)}</span>
            </div>
          </div>
        `,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to send email");
    }
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};
