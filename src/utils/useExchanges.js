import { useState, useEffect } from 'react';
import config from 'config';
import { authHeader, authRefresh } from '../helpers';

export const useExchanges = () => {
  const [coins, setCoins] = useState([]);

  useEffect(() => {
    const uri = `${config.apiUrl}/get_exchanges`;
    const options = {
      method: 'GET',
      headers: authHeader()
    };
    fetch(uri, options)
      .then(response => {
        if (response.ok) return response.json();
        else return authRefresh({ uri: uri, opts: options });
      })
      .then(data => {
        if (data.error) return;
        const formatted = data.map(coin => {
          const link = 'https://cryptocompare.com' + coin.exch_logo_url;
          delete coin.img_url;
          return {
            ...coin,
            img_url: link
          };
        });
        setCoins(formatted);
      });
  }, []);

  return coins;
};
