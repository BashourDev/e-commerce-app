export default function formatAddress({
  address1,
  city,
  province,
  zip,
  country,
}) {
  return [address1, `${city}, ${province} ${zip}`, country];
}
