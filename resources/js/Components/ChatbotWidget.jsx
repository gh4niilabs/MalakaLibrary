import axios from 'axios';
import { useState } from 'react';

const initialMessages = [{ role: 'assistant', content: 'Halo! Aku Malaka Assistant. Mau cari buku atau tanya tentang layanan perpustakaan?' }];

export default function ChatbotWidget() {
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState(initialMessages);
    const [loading, setLoading] = useState(false);

    const sendMessage = async (event) => {
        event.preventDefault();
        const message = input.trim();
        if (!message || loading) return;

        setInput('');
        setMessages((current) => [...current, { role: 'user', content: message }]);
        setLoading(true);

        try {
            const response = await axios.post(route('chatbot'), { message });
            setMessages((current) => [...current, { role: 'assistant', content: response.data.message }]);
        } catch (error) {
            setMessages((current) => [...current, { role: 'assistant', content: error.response?.data?.message || 'Maaf, chatbot sedang mengalami gangguan.' }]);
        } finally {
            setLoading(false);
        }
    };

    return <>
        {open && <section className="fixed bottom-24 right-4 z-[70] flex h-[min(560px,calc(100vh-7rem))] w-[min(380px,calc(100vw-2rem))] flex-col border border-[#3A2927] bg-[#151313] shadow-2xl shadow-black/50" aria-label="Malaka Assistant">
            <header className="flex items-center justify-between border-b border-[#3A2927] bg-[#201F1F] px-4 py-3"><div><p className="font-headline-sm text-headline-sm text-white">Malaka Assistant</p><p className="font-meta-sm text-meta-sm uppercase tracking-wider text-[#737373]">Katalog & layanan perpustakaan</p></div><button onClick={() => setOpen(false)} className="text-xl text-[#A3A3A3] hover:text-white" aria-label="Tutup chatbot">×</button></header>
            <div className="flex-1 space-y-3 overflow-y-auto p-4">{messages.map((item, index) => <div key={`${item.role}-${index}`} className={`flex ${item.role === 'user' ? 'justify-end' : 'justify-start'}`}><p className={`max-w-[85%] whitespace-pre-wrap px-3 py-2 font-body-md text-body-md ${item.role === 'user' ? 'bg-primary-container text-white' : 'border border-[#3A2927] bg-[#201F1F] text-[#E5E2E1]'}`}>{item.content}</p></div>)}{loading && <p className="font-meta-sm text-meta-sm text-[#737373]">Malaka Assistant sedang mengetik...</p>}</div>
            <form onSubmit={sendMessage} className="flex gap-2 border-t border-[#3A2927] p-3"><input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Tulis pertanyaan..." className="min-w-0 flex-1 border border-[#3A2927] bg-[#0E0E0E] px-3 py-2 font-body-md text-body-md text-white outline-none placeholder:text-[#737373] focus:border-[#FFB4AB]" /><button disabled={loading || !input.trim()} className="bg-primary-container px-3 py-2 font-label-md text-label-md text-white disabled:opacity-40" aria-label="Kirim pesan">Kirim</button></form>
        </section>}
        <button onClick={() => setOpen((current) => !current)} className="fixed bottom-5 right-5 z-[70] flex h-14 w-14 items-center justify-center rounded-full bg-primary-container text-2xl text-white shadow-lg shadow-black/40 transition-transform hover:scale-105" aria-label={open ? 'Tutup chatbot' : 'Buka chatbot'}>{open ? '×' : '✦'}</button>
    </>;
}
