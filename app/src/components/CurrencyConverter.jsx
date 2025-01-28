import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/CurrencyConvert.css";
import appIcon from "../images/app-icon.png"; // Görseli import et

const API_KEY = "3a6d924dd0176b8f122cbadc"; // Buraya kendi API anahtarınızı ekleyin
const API_URL = (currency) =>
  `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${currency}`;

function CurrencyConverter() {
  const [currencies, setCurrencies] = useState([]); // Tüm para birimlerini saklamak için
  const [fromCurrency, setFromCurrency] = useState("USD"); // Çevrilecek para birimi
  const [toCurrency, setToCurrency] = useState("EUR"); // Hedef para birimi
  const [amount, setAmount] = useState(1); // Çevrilecek miktar
  const [result, setResult] = useState(null); // Çeviri sonucu
  const [error, setError] = useState(null); // Hata mesajlarını saklamak için

  // Döviz kurlarını çekme
  const fetchCurrencies = (currency) => {
    axios
      .get(API_URL(currency))
      .then((response) => {
        setCurrencies(Object.keys(response.data.conversion_rates)); // Para birimlerini listele
      })
      .catch(() => {
        setError("Döviz kurları yüklenirken hata oluştu.");
      });
  };

  // Döviz çevirmeyi başlatma
  const convertCurrency = () => {
    if (amount <= 0) {
      setError("Lütfen geçerli bir miktar girin.");
      setResult(null);
      return;
    }

    setError(null);
    axios
      .get(API_URL(fromCurrency))
      .then((response) => {
        const rate = response.data.conversion_rates[toCurrency];
        setResult((amount * rate).toFixed(2)); // Çeviri işlemi
      })
      .catch(() => {
        setError("Döviz çevirisi sırasında bir hata oluştu.");
      });
  };

  // Miktar değişimlerini kontrol et
  const handleAmountChange = (e) => {
    const newAmount = e.target.value;
    setAmount(newAmount);
    if (newAmount <= 0) {
      setResult(null); // Miktar geçerli değilse sonucu sıfırla
    }
  };

  // İlk render ve fromCurrency değiştiğinde para birimlerini yükle
  useEffect(() => {
    fetchCurrencies(fromCurrency);
  }, [fromCurrency]);

  return (
    <div className="wrapper">
      <div className="app-details">
        <img className="app-icon" src={appIcon} alt="App Icon" />
        <h1 className="app-title">Döviz Çevirici</h1>
      </div>

      {error && <div id="error-message">{error}</div>}

      <label htmlFor="amount">Miktar:</label>
      <input
        type="number"
        id="amount"
        value={amount}
        onChange={handleAmountChange}
        placeholder="Miktar"
      />

      <div className="dropdowns">
        <select
          id="from-currency-select"
          value={fromCurrency}
          onChange={(e) => setFromCurrency(e.target.value)}
        >
          {currencies.map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>

        <select
          id="to-currency-select"
          value={toCurrency}
          onChange={(e) => setToCurrency(e.target.value)}
        >
          {currencies.map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>
      </div>

      <button id="convert-button" onClick={convertCurrency}>
        Çevir
      </button>

      {result !== null ? (
        <div id="result">
          {amount} {fromCurrency} = {result} {toCurrency}
        </div>
      ) : (
        amount <= 0 && (
          <div id="error-message">Lütfen geçerli bir miktar girin.</div>
        )
      )}
    </div>
  );
}

export default CurrencyConverter;
