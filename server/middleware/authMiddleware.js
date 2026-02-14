export const protect = async (req, res, next) => {
    try {
        const { userId, has } = await req.auth();
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const hasPremiumPlan = has({ plan: "premium" });
        req.plan = hasPremiumPlan ? "premium" : "free";
        return next();
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.error(error);
    }
};