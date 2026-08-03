import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        admin: resolve(__dirname, 'admin.html'),
        booking: resolve(__dirname, 'booking.html'),
        contact: resolve(__dirname, 'contact.html'),
        gallery: resolve(__dirname, 'gallery.html'),
        login: resolve(__dirname, 'login.html'),
        services: resolve(__dirname, 'services.html'),
        productDetails: resolve(__dirname, 'product-details.html'),
      },
    },
  },
});
