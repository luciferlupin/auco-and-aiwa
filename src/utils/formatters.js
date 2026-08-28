// Ultra-defensive utility formatting functions with complete error fallbacks

export const formatCurrency = (amount) => {
  try {
    if (amount === null || amount === undefined || isNaN(Number(amount))) {
      return '₹0';
    }
    const num = Number(amount);
    if (!isFinite(num)) return '₹0';

    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(num);
  } catch (err) {
    console.warn('Currency format fallback:', err);
    return `₹${amount || 0}`;
  }
};

export const formatDate = (dateString) => {
  if (!dateString) return '—';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return String(dateString);
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  } catch (err) {
    return String(dateString || '—');
  }
};

export const formatDateTime = (dateString) => {
  if (!dateString) return '—';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return String(dateString);
    return d.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (err) {
    return String(dateString || '—');
  }
};

export const getWhatsAppUrl = (phone, message = '') => {
  try {
    if (!phone) return '#';
    let cleanPhone = String(phone).replace(/\D/g, '');
    if (!cleanPhone) return '#';
    
    if (cleanPhone.length === 10) {
      cleanPhone = '91' + cleanPhone;
    }
    const encodedMsg = encodeURIComponent(message || 'Hello from Auco & Aiwa!');
    return `https://wa.me/${cleanPhone}?text=${encodedMsg}`;
  } catch (err) {
    return '#';
  }
};

export const getStatusBadgeClass = (status) => {
  if (!status || typeof status !== 'string') return 'badge-neutral';
  const s = status.toLowerCase().trim();
  
  if (['won', 'paid', 'completed', 'delivered', 'qualified', 'converted', 'active', 'in stock', 'received'].includes(s)) {
    return 'badge-success';
  }
  if (['in progress', 'dispatched', 'in transit', 'out for delivery', 'sent', 'proposal', 'negotiation', 'partially paid', 'contacted', 'pending', 'reserved'].includes(s)) {
    return 'badge-warning';
  }
  if (['lost', 'overdue', 'cancelled', 'out of stock', 'missed', 'inactive', 'high', 'urgent', 'delayed', 'returned'].includes(s)) {
    return 'badge-danger';
  }
  if (['new lead', 'to do', 'draft', 'new', 'scheduled', 'ready for dispatch'].includes(s)) {
    return 'badge-info';
  }
  return 'badge-neutral';
};

export const generateId = (prefix = 'ID') => {
  try {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `${prefix || 'ID'}-${randomNum}`;
  } catch (err) {
    return `${prefix || 'ID'}-${Date.now() % 10000}`;
  }
};
