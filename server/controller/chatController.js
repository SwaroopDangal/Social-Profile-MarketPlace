export const getChat = async (req, res) => {
    try {
        const { userId } = await req.auth();
        const { listingId, chatId } = req.body;

        const listing = await prisma.listing.findUnique({
            where: { id: listingId },
        })
        if (!listing) {
            return res.status(404).json({ error: 'Listing not found' });
        }

        // FInd existing chat
        let existingChat = null;
        if (chatId) {
            existingChat = await prisma.chat.findFirst({
                where: { id: chatId, OR: [{ chatUserId: userId }, { ownerUserId: userId }] },
                include: { listing: true, ownerUser: true, chatUser: true, messages: true },

            })
        } else {
            existingChat = await prisma.chat.findFirst({
                where: { listingId: listingId, chatUserId: userId, ownerUserId: listing.ownerId },
                include: { listing: true, ownerUser: true, chatUser: true, messages: true },
            })

        }
        if (existingChat) {
            res.json({ chat: existingChat })
            if (existingChat.isLastMessageRead === false) {
                const lastMessage = existingChat.messages[existingChat.messages.length - 1]
                const isLastMessageSendByMe = lastMessage.sender_id === userId
                if (!isLastMessageSendByMe) {
                    await prisma.chat.update({
                        where: { id: existingChat.id },
                        data: { isLastMessageRead: true },
                    })
                }
            }
            return null;
        }

        const newChat = await prisma.chat.create({
            data: {
                listingId: listingId,
                ownerUserId: listing.ownerId,
                chatUserId: userId,
            },
        })

        const chatWithData = await prisma.chat.findUnique({
            where: { id: newChat.id },
            include: { listing: true, ownerUser: true, chatUser: true, messages: true },
        })

        return res.json({ chat: chatWithData })


    } catch (error) {
        res.status(500).json({ error: error.message });
        console.error(error);
    }
}

// get all user chats
export const getAllChats = async (req, res) => {
    try {
        const { userId } = await req.auth();
        const chats = await prisma.chat.findMany({
            where: { OR: [{ ownerUserId: userId }, { chatUserId: userId }] },
            include: { listing: true, ownerUser: true, chatUser: true, messages: true },
            orderBy: { updateAt: 'desc' },
        })
        if (!chats || chats.length === 0) {
            return res.json({ chats: [] });
        }
        res.json({ chats })
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.error(error);
    }
}

// add messages to chat
export const sendMessage = async (req, res) => {
    try {
        const { userId } = await req.auth();
        const { chatId, message } = req.body;

        const chat = await prisma.chat.findFirst({
            where: { AND: [{ id: chatId, OR: [{ chatUserId: userId }, { ownerUserId: userId }] }] },
            include: { listing: true, ownerUser: true, chatUser: true },
        })
        if (!chat) {
            return res.status(404).json({ error: 'Chat not found' });
        } else if (chat.listing.status !== 'active') {
            return res.status(400).json({ error: 'Listing is not active' });
        }
        const newMessage = {
            message,
            sender_id: userId,
            chatId,
            createdAt: new Date(),
        }
        await prisma.message.create({
            data: newMessage,
        })

        res.status(200).json({ message: 'Message sent successfully', newMessage })

        await prisma.chat.update({
            where: { id: chat.id },
            data: { lastMessage: newMessage.message, isLastMessageRead: false, lastMessageSenderId: userId },
            include: { messages: true },
        })



    } catch (error) {
        res.status(500).json({ error: error.message });
        console.error(error);
    }
}