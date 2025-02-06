"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

interface Deeplink {
  destinationUrl: string;
  intervalInSeconds: string;
  id: string;
  name: string;
}

export default function DeepLinkGenerator() {
  const [deeplinks, setDeeplinks] = useState<Deeplink[]>([]);
  const [formData, setFormData] = useState<Deeplink>({
    destinationUrl: "",
    intervalInSeconds: "",
    id: "",
    name: "",
  });

  useEffect(() => {
    const storedLinks = Cookies.get("deeplinks");
    if (storedLinks) {
      setDeeplinks(JSON.parse(storedLinks));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generateDeeplink = () => {
    const { destinationUrl, intervalInSeconds, id, name } = formData;
    if (!destinationUrl || !intervalInSeconds || !id || !name) return;

    const updatedDeeplinks = [...deeplinks, { ...formData }];
    setDeeplinks(updatedDeeplinks);
    Cookies.set("deeplinks", JSON.stringify(updatedDeeplinks), { expires: 7 });
  };

  const clearDeeplinks = () => {
    setDeeplinks([]);
    Cookies.remove("deeplinks");
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-xl font-bold mb-4">Gerador de DeepLinks</h1>
      <div className="space-y-2">
        <Input name="destinationUrl" placeholder="Destination URL" value={formData.destinationUrl} onChange={handleChange} />
        <Input name="intervalInSeconds" placeholder="Interval in Seconds" value={formData.intervalInSeconds} onChange={handleChange} />
        <Input name="id" placeholder="ID" value={formData.id} onChange={handleChange} />
        <Input name="name" placeholder="Name" value={formData.name} onChange={handleChange} />
        <div className="space-y-2 flex items-center justify-center gap-4">
          <Button onClick={generateDeeplink} className="">Gerar DeepLink</Button>
          <Button onClick={clearDeeplinks} className="bg-red-500 hover:bg-red-700">Limpar DeepLinks</Button>
        </div>
      </div>
      <ul className="mt-4 space-y-2">
        {deeplinks.map((link, index) => (
          <li key={index} className="p-2 bg-gray-100 rounded">
            <a href={`flwconnect://instructions?destinationUrl=${encodeURIComponent(link.destinationUrl)}&intervalInSeconds=${link.intervalInSeconds}&id=${link.id}&name=${encodeURIComponent(link.name)}`} className="text-blue-500 underline" target="_blank" rel="noopener noreferrer">
              {link.name} - {link.id}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
