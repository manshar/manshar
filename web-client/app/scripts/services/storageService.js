'use strict';

angular.module('webClientApp')
   /**
    * Provides an easy way to store data.
    */
  .service('StorageService', function ($window) {

    return {

      /**
       * Set the value for a key.
       * @param {string} key Key to store the value for.
       * @param {*} value The value to store for the key.
       * @return {*} Value of the key.
       */
      set: function(key, value) {
        return $window.localStorage.setItem(key, value);
      },

      /**
       * Get the value for a key.
       * @param {string} key Key to get the value for.
       * @param {*} optDefault An optional default to return if the key doesn't gave a value.
       * @return {string} Value of the key.
       */
      get: function(key, optDefault) {
        return $window.localStorage.getItem(key) || optDefault;
      },

      /**
       * Clears a stored value for a key.
       * @param {string} key Key to remove from localStorage.
       * @return {string} Value of the deleted key.
       */
      unset: function(key) {
        return $window.localStorage.removeItem(key);
      }

    };

  });
