import React, { useState } from 'react';

const CreateChat = () => {
    const [form, setForm] = useState({
        title: '',
        description: '',
        date: '',
        duration: 60,
        creatorId: 1, // For now, static; later you can make this dynamic
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:8080/api/chats', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...form,
                    date: new Date(form.date).toISOString(),
                }),
            });

            if (!response.ok) {
                throw new Error(await response.text());
            }

            alert('Chat created successfully!');
            setForm({ title: '', description: '', date: '', duration: 60, creatorId: 1 });
        } catch (err) {
            alert(`Failed to create chat: ${err}`);
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '2rem auto' }}>
            <h2>Create a New Chat</h2>
            <form onSubmit={handleSubmit}>
                <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
                <br />
                <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} required />
                <br />
                <input type="datetime-local" name="date" value={form.date} onChange={handleChange} required />
                <br />
                <input type="number" name="duration" placeholder="Duration (mins)" value={form.duration} onChange={handleChange} required />
                <br />
                <input type="number" name="creatorId" placeholder="Creator ID" value={form.creatorId} onChange={handleChange} required />
                <br />
                <button type="submit">Create Chat</button>
            </form>
        </div>
    );
};

export default CreateChat;
