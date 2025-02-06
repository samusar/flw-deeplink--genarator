"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import RadioButtonGroup from "@/components/ui/RadioGroup";

type DeeplinkType = 'flwconnect' | 'exp';
type IpType = string | null;

interface Deeplink {
  destinationUrl: string;
  intervalInSeconds: string;
  id: string;
  name: string;
  type: DeeplinkType;
  ipLocal: IpType;
}

const EMPTY_DEEPLINK: Deeplink = {
  destinationUrl: "",
  intervalInSeconds: "",
  id: "",
  name: "",
  type: 'flwconnect',
  ipLocal: null,
}

export default function DeepLinkGenerator() {
  const [deeplinks, setDeeplinks] = useState<Deeplink[]>([]);

  const [formData, setFormData] = useState<Deeplink>(EMPTY_DEEPLINK);

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
    const { destinationUrl, intervalInSeconds, id, name, type, ipLocal } = formData;
    if (!destinationUrl || !intervalInSeconds || !id || !name || (type === 'exp' && !ipLocal) ) return;

    const updatedDeeplinks = [...deeplinks, { ...formData }];
    setDeeplinks(updatedDeeplinks);
    Cookies.set("deeplinks", JSON.stringify(updatedDeeplinks), { expires: 7 });
    setFormData(EMPTY_DEEPLINK)
  };

  const clearDeeplinks = () => {
    setDeeplinks([]);
    Cookies.remove("deeplinks");
  };

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      alert("Link copiado para a área de transferência!");
    }).catch(() => {
      alert("Falha ao copiar o link.");
    });
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-xl font-bold mb-4">Gerador de DeepLinks</h1>
      <div className="space-y-2">
        <RadioButtonGroup name="type" value={formData.type} options={[{ display: 'APK', value: 'flwconnect' }, { display: 'EXPO', value: 'exp'}]} onChange={handleChange} defaultValue={formData.type} />
        {formData.type === 'exp' && <Input name="typeComplement" placeholder="IP local" value={formData.ipLocal || ''} onChange={handleChange} />}
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
        {deeplinks.map((link, index) => {
          const urlDeeplink = `${formData.type !== 'exp' ? 'flwconnect://instructions' : `exp://${link.ipLocal}:19000/@samusar16/flwconnect`}?destinationUrl=${encodeURIComponent(link.destinationUrl)}&intervalInSeconds=${link.intervalInSeconds}&id=${link.id}&name=${encodeURIComponent(link.name)}`
          
          return (
          <li key={index} className="p-2 bg-gray-100 rounded flex flex-col items-stretch">
            <a href={urlDeeplink} className="text-blue-500 underline" target="_blank" rel="noopener noreferrer">
              {link.name} - {link.id}
            </a>
            <Button onClick={() => handleCopy(urlDeeplink)} className="mt-2 w-full text-left">
              Copiar Link
            </Button>
          </li>
        )})}
      </ul>
    </div>
  );
}
