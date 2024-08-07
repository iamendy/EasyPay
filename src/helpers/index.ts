function formatDate(dateString: string) {
  const date = new Date(dateString);

  // Format the date
  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Format the time
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const formattedTime = `${hours}:${minutes}`;

  return `${formattedDate} | ${formattedTime}`;
}

function formatUnixTimestamp(timestamp: string | BigInt): string {
  // Convert the timestamp to milliseconds (required by JavaScript Date object)
  //@ts-ignore
  const date = new Date(parseInt(timestamp) * 1000);

  // Define months array for converting month index to month name
  const months: string[] = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Extract the components of the date
  const month: string = months[date.getMonth()];
  const day: number = date.getDate();
  const year: number = date.getFullYear();
  const hour: number = date.getHours();
  const minute: number = date.getMinutes();

  // Pad single digit minute with leading zero
  const formattedMinute: string =
    minute < 10 ? "0" + minute : minute.toString();

  // Create the formatted string
  const formattedDate: string = `${month} ${day}, ${year} | ${hour}:${formattedMinute}`;

  return formattedDate;
}

const isValidAddress = (address: string) => {
  return /^(0x)?[0-9a-f]{40}$/i.test(address);
};

export { formatDate, isValidAddress, formatUnixTimestamp };
