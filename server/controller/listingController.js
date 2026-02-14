import imageKit from "../configs/imageKits.js";
import { prisma } from "../configs/prisma.js"
import fs from "fs";

// Add listing

export const addListing = async (req, res) => {
    try {
        const { userId } = await req.auth();
        if (req.plan !== "premium") {
            const listingCount = await prisma.listing.count({ where: { ownerId: userId } });
            if (listingCount >= 5) {
                return res.status(400).json({ error: "You have reached the maximum number of listings allowed for your plan." });
            }
        }
        const accountDetails = JSON.parse(req.body.accountDetails);
        accountDetails.followers_count = parseFloat(accountDetails.followers_count);
        accountDetails.engagement_rate = parseFloat(accountDetails.engagement_rate);
        accountDetails.monthly_views = parseFloat(accountDetails.monthly_views);
        accountDetails.price = parseFloat(accountDetails.price);
        accountDetails.platform = accountDetails.platform.toLowerCase();
        accountDetails.niche = accountDetails.niche.toLowerCase();
        accountDetails.username.startsWith("@") ? accountDetails.username = accountDetails.username.slice(1) : null;

        const uploadImages = req.files.map(async (file) => {
            const response = await imageKit.files.upload({
                file: fs.createReadStream(file.path),
                fileName: `${Date.now()}.png`,
                folder: "filpearn",
                transformation: { pre: 'w-1280,h-auto' },
            });
            return response.url;
        })

        const images = await Promise.all(uploadImages);

        const listing = await prisma.listing.create({
            data: {
                ownerId: userId,
                images,
                ...accountDetails,
            }
        });
        res.status(201).json({ message: "Listing created successfully", listing });

    } catch (error) {
        res.status(500).json({ error: error.message });
        console.error(error);
    }
}

// Get all public listings
export const getPublicListings = async (req, res) => {
    try {
        const listings = await prisma.listing.findMany({
            where: { status: "active" },
            include: { owner: true },
            orderBy: { createdAt: "desc" },
        });
        if (!listings || listings.length === 0) {
            return res.json({ listings: [] });
        }
        res.status(200).json({ listings });
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.error(error);
    }
}

// Get all user listing
export const getUserListings = async (req, res) => {
    try {
        const { userId } = await req.auth();
        const listings = await prisma.listing.findMany({
            where: { ownerId: userId, status: { not: "deleted" } },
            orderBy: { createdAt: "desc" },
        });
        const user = await prisma.user.findUnique({ where: { id: userId } });

        const balance = {
            earned: user.earned,
            withdrawn: user.withdrawn,
            available: user.earned - user.withdrawn,
        }

        if (!listings || listings.length === 0) {
            return res.json({ listings: [], balance });
        }

        res.status(200).json({ listings, balance });
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.error(error);
    }
}

// Updating listing
export const updateListing = async (req, res) => {
    try {
        const { userId } = await req.auth();
        const accountDetails = JSON.parse(req.body.accountDetails);

        if (req.files.length + accountDetails.images.length > 5) {
            return res.status(400).json({ error: "You can upload a maximum of 5 images per listing." });
        }

        accountDetails.followers_count = parseFloat(accountDetails.followers_count);
        accountDetails.engagement_rate = parseFloat(accountDetails.engagement_rate);
        accountDetails.monthly_views = parseFloat(accountDetails.monthly_views);
        accountDetails.price = parseFloat(accountDetails.price);
        accountDetails.platform = accountDetails.platform.toLowerCase();
        accountDetails.niche = accountDetails.niche.toLowerCase();
        accountDetails.username.startsWith("@") ? accountDetails.username = accountDetails.username.slice(1) : null;

        const listing = await prisma.listing.update({
            where: { id: accountDetails.id, ownerId: userId },
            data: accountDetails,

        })

        if (!listing) {
            return res.status(404).json({ error: "Listing not found" });
        }
        if (listing.status === "sold") {
            return res.status(400).json({ error: "You cannot update a sold listing" });
        }
        if (req.files.length > 0) {
            const uploadImages = req.files.map(async (file) => {
                const response = await imageKit.files.upload({
                    file: fs.createReadStream(file.path),
                    fileName: `${Date.now()}.png`,
                    folder: "filpearn",
                    transformation: { pre: 'w-1280,h-auto' },
                });
                return response.url;
            })

            const images = await Promise.all(uploadImages);

            const listing = await prisma.listing.update({
                where: { id: accountDetails.id, ownerId: userId },
                data: {
                    ownerId: userId,
                    images: [...accountDetails.images, ...images],
                    ...accountDetails,
                }
            })

            return res.status(200).json({ message: "Listing updated successfully", listing });
        }
        res.status(200).json({ message: "Listing updated successfully", listing });




    } catch (error) {
        res.status(500).json({ error: error.message });
        console.error(error);
    }
}

// Toggle listing status
export const toggleStatus = async (req, res) => {
    try {
        const { userId } = await req.auth();
        const { id } = req.params;
        const listing = await prisma.listing.findUnique({
            where: { id, ownerId: userId },
        })
        if (!listing) {
            return res.status(404).json({ error: "Listing not found" });
        }
        if (listing.status === "active" || listing.status === "inactive") {
            await prisma.listing.update({
                where: { id, ownerId: userId },
                data: { status: listing.status === "active" ? "inactive" : "active" }
            })
        } else if (listing.status === "ban") {
            return res.status(400).json({ error: "Your listing is banned" });
        } else if (listing.status === "sold") {
            return res.status(400).json({ error: "You cannot update a sold listing" });
        }
        return res.status(200).json({ message: "Listing status updated successfully", listing });
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.error(error);
    }
}

// Delete listing
export const deleteListing = async (req, res) => {
    try {
        const { userId } = await req.auth();
        const { id } = req.params;
        const listing = await prisma.listing.findFirst({
            where: { id, ownerId: userId },
            include: { owner: true },
        })
        if (!listing) {
            return res.status(404).json({ error: "Listing not found" });
        }
        if (listing.status === "sold") {
            return res.status(400).json({ error: "You cannot delete a sold listing" });
        }
        if (listing.isCredentialChanged) {
            // send email to owner
        }
        await prisma.listing.update({
            where: { id, ownerId: userId },
            data: { status: "deleted" }
        })
        return res.status(200).json({ message: "Listing deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.error(error);
    }
}

// Add credentials to listing
export const addCredentials = async (req, res) => {
    try {
        const { userId } = await req.auth();
        const { listingId, credentials } = req.body;

        if (!listingId || !credentials) {
            return res.status(400).json({ error: "Listing ID and credentials are required" });
        }
        const listing = await prisma.listing.findFirst({
            where: { id: listingId, ownerId: userId },
            include: { owner: true },
        })
        if (!listing) {
            return res.status(404).json({ error: "Listing not found" });
        }
        await prisma.credential.create({
            data: {
                listingId,
                originalCredential: credentials,
            }
        })
        await prisma.listing.update({
            where: { id: listingId },
            data: { isCredentialSubmitted: true }
        })
        return res.status(200).json({ message: "Credentials added successfully", listing });
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.error(error);
    }
}

// Mark Featured
export const markFeatured = async (req, res) => {
    try {
        const { userId } = await req.auth();
        const { id } = req.params;
        if (req.plan !== "premium") {
            return res.status(403).json({ error: "You need to be on the premium plan to access this feature" });
        }
        await prisma.listing.updateMany({
            where: { id, ownerId: userId },
            data: { featured: false }
        })

        const listing = await prisma.listing.findUnique({
            where: { id, ownerId: userId },
            include: { owner: true },
        })
        if (!listing) {
            return res.status(404).json({ error: "Listing not found" });
        }
        if (listing.status === "sold") {
            return res.status(400).json({ error: "You cannot mark a sold listing as featured" });
        }
        await prisma.listing.update({
            where: { id, ownerId: userId },
            data: { featured: true }
        })
        return res.status(200).json({ message: "Listing marked as featured successfully", listing });
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.error(error);
    }
}

// Get all orders of user
export const getOrders = async (req, res) => {
    try {
        const { userId } = await req.auth();
        const orders = await prisma.transaction.findMany({
            where: { userId },
            include: { listing: true },
            orderBy: { createdAt: "desc" },
        })
        if (!orders || orders.length === 0) {
            return res.json({ orders: [] });
        }
        // Attach credential to each order
        const credentials = await prisma.credential.findMany({
            where: { listingId: { in: orders.map((order) => order.listingId) } },
            include: { listing: true },
        })

        const ordersWithCredentials = orders.map((order) => {
            const credential = credentials.find((cred) => cred.listingId === order.listingId);
            return {
                ...order,
                credential
            }
        })
        res.status(200).json({ orders: ordersWithCredentials });
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.error(error);
    }
}

// Withdraw amount
export const withdrawAmount = async (req, res) => {
    try {
        const { userId } = await req.auth();
        const { amount, account } = req.body;
        if (amount <= 0) {
            return res.status(400).json({ error: "Amount must be greater than 0" });
        }
        const user = await prisma.user.findUnique({ where: { id: userId } });
        const balance = user.earned - user.withdrawn;
        if (amount > balance) {
            return res.status(400).json({ error: "You cannot withdraw more than your available balance" });
        }
        const withdrawal = await prisma.withdrawal.create({
            data: {
                userId,
                amount,
                account,
            }
        })
        await prisma.user.update({
            where: { id: userId },
            data: { withdrawn: { increment: amount } }
        })
        return res.status(200).json({ message: "Applied for withdrawal successfully", withdrawal });
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.error(error);
    }
}

// purchase account
export const purchaseAccount = async (req, res) => {}
