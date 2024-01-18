export const orderStatus = [
  { name: "OrderReceived", label: "Pedido Recebido" },
  { name: "Processing", label: "Em Processamento" },
  { name: "WaitingForPaymentConfirmation", label: "Aguardando Pagamento" },
  { name: "Shipped", label: "Enviado" },
  { name: "Concluded", label: "Concluído" },
  { name: "Cancelled", label: "Cancelado" },
  { name: "WaitingForPickup", label: "Aguardando Retirada" }
];

export const getStatus = (name) => {
  return orderStatus.find(status => status.name === name);
};