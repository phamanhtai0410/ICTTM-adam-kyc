const Schemas = [
  { schema: 'LegalEntity', humanName: 'Legal Entity' },
  { schema: 'Address', humanName: 'Address' },
  { schema: 'BankAccount', humanName: 'Bank Account' },
  { schema: 'CryptoWallet', humanName: 'Crypto Wallet' },
  { schema: 'Security', humanName: 'Security' },
  { schema: 'Vessel', humanName: 'Vessel' },
  { schema: 'Person', humanName: 'Person' },
  { schema: 'Company', humanName: 'Company' },
  { schema: 'Organization', humanName: 'Organization' }
]

export function formatSchema (schema) {
  return Schemas.find(item => item.schema === schema)?.humanName
}
