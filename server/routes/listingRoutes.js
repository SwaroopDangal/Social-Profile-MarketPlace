import express from "express"
import { addListing, getPublicListings, getUserListings, updateListing, toggleStatus, deleteListing, addCredentials, markFeatured, getOrders, withdrawAmount, purchaseAccount } from "../controller/listingController.js"
import { protect } from "../middleware/authMiddleware.js"
import upload from "../configs/multer.js"

const router = express.Router()

router.post("/", upload.array("images", 5), protect, addListing)
router.put("/", upload.array("images", 5), protect, updateListing)
router.get("/public", getPublicListings)
router.get("/user", protect, getUserListings)
router.put("/:id/status", protect, toggleStatus)
router.delete("/:listingId", protect, deleteListing)
router.post("/add-credential", protect, addCredentials)
router.put("/featured/:id", protect, markFeatured)
router.get("/user-orders", protect, getOrders)
router.post("/withdrawn", protect, withdrawAmount)
router.post("/purchase-account/:listingId", protect, purchaseAccount)


export default router