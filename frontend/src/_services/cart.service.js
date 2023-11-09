import {authHeader} from "../_helpers";
import {config} from "../config";
import {handleResponse} from "../_helpers/handle-response";
import Cookies from 'js-cookie'

const addProdToCart = (product) => {
    const header = authHeader();

    const requestOptions = {
        method: 'GET',
    };
    try {
        console.log("Add to cart ", requestOptions);
        addItemToCartCookie(product.id);

        // user logged in
        if (header) {
            requestOptions.headers = header;
            return fetch(`${config.apiUrl}/add/to/cart/` + product.id, requestOptions).then(handleResponse);
        }
        return Promise.resolve('ok');
    } catch (e) {}
    return Promise.reject('Bad request')
}

const removeCartCookie = () => {
    Cookies.remove('cart');
}

const addItemToCartCookie = id => {
    return new Promise((resolve, reject) => {
        let cart = Cookies.get('cart');
        try {
            cart = JSON.parse(cart);
            let _ = cart.items;
        } catch (e) {
            console.log(e);
            cart = {
                items: []
            };
        }

        cart = {
            ...cart,
            items: [...cart.items, id]
        };
        Cookies.set('cart', cart);

        resolve("Added item to cart");
    });
}

const removeItemFromCartCookie = id => {
    return new Promise((resolve, reject) => {
        let cart = Cookies.get('cart');
        try {
            cart = JSON.parse(cart);
            let _ = cart.items;
        } catch (e) {
            console.log(e);
            cart = {
                items: []
            };
        }
        console.log('CART BEFORE: ', cart);
        cart.items = cart.items.filter(function (value, index) {
            console.log('CART DURING: ', typeof value, ' ', typeof id);
            return value.toString() !== id.toString();
        });
        console.log('CART AFTER: ', cart);

        Cookies.set('cart', cart);
        resolve("Removed item from cart");
    });
}

const loadCartAfterReload = () => {
    let cart = Cookies.get('cart');
    try {
        cart = JSON.parse(cart);

        console.log('cart:::: ', cart.items.toString());

        const requestOptions = {
            method: 'GET',
        };
        if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
            return fetch(`${config.apiUrl}/products/from/list?id=[` + cart.items.toString() + ']', requestOptions).then(handleResponse);
        } else {
            return fetch(`${config.apiUrl}/products/filtered?id=` + cart.items.toString(), requestOptions).then(handleResponse);
        }
    } catch (e) {}
    return Promise.resolve([]);
}

const orderFromCart = () => {
    let cart = Cookies.get('cart');
    try {
        cart = JSON.parse(cart);

        const requestOptions = {
            method: 'GET',
            credentials: 'include'
        };

        if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
            return fetch(`${config.apiUrl}/order/from/list?id=[` + cart.items.toString() + ']', requestOptions).then(handleResponse);
        } else {
            return fetch(`${config.apiUrl}/order/list?id=` + cart.items.toString(), requestOptions).then(handleResponse);
        }
    } catch (e) {}
    return Promise.resolve([]);
}

const getAllOrders = () => {
    const requestOptions = {
        method: 'GET',
        credentials: 'include'
    };

    return fetch(`${config.apiUrl}/orders/all`, requestOptions).then(handleResponse)
}

export const cartService = {
    addProdToCart,
    removeCartCookie,
    addItemToCartCookie,
    loadCartAfterReload,
    removeItemFromCartCookie,
    orderFromCart,
    getAllOrders
};
