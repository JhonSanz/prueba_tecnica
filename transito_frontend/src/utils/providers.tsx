'use client';

import { useState, useEffect } from 'react';
import { usePathname } from "next/navigation";
import { ThemeProvider } from '@/app/positions/positions';
import BrokerService from "@/app/services/broker";
import CurrencyService from '@/app/services/currency';
import AccountService from '@/app/services/account';

export function Providers({ children }: any) {
  const pathname = usePathname();
  const [brokers, setBrokers] = useState<Array<any>>([]);
  const [accountBroker, setAccountBroker] = useState<Array<any>>([]);
  const [currencies, setCurrencies] = useState<Array<any>>([]);
  const [accounts, setAccounts] = useState<Array<any>>([]);
  const [selectedBroker, setSelectedBroker] = useState<string>("");
  const [selectedAccount, setSelectedAccount] = useState<any>({});

  async function getBrokerData(token?: string): Promise<any> {
    const brokerService = new BrokerService();
    const data = await brokerService.get({}, token);
    if (data.error) return { data: [] };
    return data.response;
  }

  async function getCurrenciesData(token?: string): Promise<any> {
    const currencyService = new CurrencyService();
    const data = await currencyService.get({}, token);
    if (data.error) return { data: [] };
    return data.response;
  }

  async function getAccountsData(token?: string): Promise<any> {
    const accountService = new AccountService();
    const data = await accountService.get({}, token);
    if (data.error) return { data: [] };
    return data.response;
  }

  async function fetchBrokersData(token?: string) {
    const brokers = await getBrokerData(token);
    setBrokers(brokers.data);

    const result = new Array<any>;
    brokers.data.forEach((item: any) => {
      result.push(...item.accounts.map((account: any) => { return { ...account, broker: item.id } }))
    })
    setAccountBroker(result);
  }

  async function fetchCurrenciesData(token?: string) {
    const currencies = await getCurrenciesData(token);
    setCurrencies(currencies.data);
  }

  async function fetchAccountsData(token?: string) {
    const currencies = await getAccountsData(token);
    setAccounts(currencies.data);
  }

  useEffect(() => {
    if (["/", "/login"].includes(pathname)) return;
    fetchBrokersData();
    fetchCurrenciesData();
    fetchAccountsData();
  }, []);


  return (
    <ThemeProvider.Provider value={{
      brokers, accountBroker, currencies,
      selectedBroker, setSelectedBroker,
      selectedAccount, setSelectedAccount,
      accounts, setAccounts,
      fetchBrokersData, fetchCurrenciesData, fetchAccountsData
    }}>
      {children}
    </ThemeProvider.Provider>
  );
}
