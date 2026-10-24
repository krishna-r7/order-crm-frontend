import requests from "./httpService";

const OrderService = {

    getOrders: async (params = {}) => {
        return requests.get(`/orders`, { params });
    },

    getOrderById: async (id) => {
        return requests.get(`/orders/${id}`);
    },

}

export default OrderService;
