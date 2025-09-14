

export async function fetchContents() {
    const res = await fetch('https://closet-recruiting-api.azurewebsites.net/api/data');
    if (!res.ok) throw new Error('Failed to fetch data');
    return res.json();
  }
  