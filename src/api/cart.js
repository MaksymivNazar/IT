const CART_KEY = 'cart_items';

export const getCart = () => {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return [];
    try {
        return JSON.parse(raw);
    } catch {
        return [];
    }
};

const saveCart = (items) => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
};

export const addToCart = (service) => {
    if (!service || !service.id) return false;

    const cart = getCart();
    const exists = cart.some((item) => String(item.id) === String(service.id));

    if (exists) return false;

    const itemToSave = {
        id: service.id,
        name: service.name,
        price: service.price,
        durationMinutes: service.durationMinutes,
        masterId: service.masterId || service.master?.id || null,
    };

    cart.push(itemToSave);
    saveCart(cart);
    return true;
};

export const removeFromCart = (serviceId) => {
    const cart = getCart();
    const updated = cart.filter(
        (item) => String(item.id) !== String(serviceId),
    );
    saveCart(updated);
    return updated;
};

export const clearCart = () => {
    saveCart([]);
};
