const Course = require("../../models/Course");
const Order = require("../../models/Order");
const Student = require("../../models/StudentModel");

function toNumber(value) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : 0;
}

function getCourseDiscountPercent(course) {
  const candidates = [
    course?.discountPercent,
    course?.discountPercentage,
    course?.discount,
    course?.offerPercent,
  ];

  for (const value of candidates) {
    const numeric = Number(value);
    if (Number.isFinite(numeric) && numeric > 0) {
      return Math.max(0, Math.min(numeric, 100));
    }
  }

  return 0;
}

/* STUDENT — CREATE ORDER (PENDING) */
exports.createOrder = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { courseId, paymentMethod = "card" } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "courseId is required",
      });
    }

    const course = await Course.findOne({ _id: courseId, isPublished: true }).lean();
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found or not published",
      });
    }

    const existingEnrollment = await Student.findOne({
      userId,
      "courses.courseId": courseId,
    }).lean();

    if (existingEnrollment) {
      return res.status(409).json({
        success: false,
        message: "You are already enrolled in this course",
      });
    }

    const originalPrice = toNumber(course.pricing);
    const discountPercent = getCourseDiscountPercent(course);
    const discountAmount = (originalPrice * discountPercent) / 100;
    const amount = Math.max(0, originalPrice - discountAmount);

    const order = await Order.create({
      userId,
      courseId,
      courseTitleAtPurchase: course.title,
      courseImageAtPurchase: course?.image?.url || "",
      originalPrice,
      discountPercent,
      discountAmount,
      amount,
      currency: "USD",
      paymentMethod,
      paymentStatus: "pending",
      orderStatus: "created",
    });

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      order,
    });
  } catch (err) {
    console.error("Create order error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  } 
};

/* STUDENT — CONFIRM PAYMENT
   On paid status, enroll student */
exports.confirmOrderPayment = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { orderId } = req.params;
    const {
      paymentStatus = "paid",
      transactionId,
      gatewayOrderId,
      gatewayPaymentId,
    } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const order = await Order.findOne({ _id: orderId, userId });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.paymentStatus === "paid") {
      return res.status(200).json({
        success: true,
        message: "Payment already confirmed",
        order,
      });
    }

    order.paymentStatus = paymentStatus;
    order.orderStatus = paymentStatus === "paid" ? "completed" : order.orderStatus;
    order.transactionId = transactionId || order.transactionId;
    order.gatewayOrderId = gatewayOrderId || order.gatewayOrderId;
    order.gatewayPaymentId = gatewayPaymentId || order.gatewayPaymentId;
    if (paymentStatus === "paid") {
      order.paidAt = new Date();
    }
    await order.save();

    if (paymentStatus === "paid") {
      const student = await Student.findOneAndUpdate(
        { userId },
        { $setOnInsert: { userId } },
        { upsert: true, new: true }
      );

      const alreadyEnrolled = student.courses.some(
        (entry) => String(entry.courseId) === String(order.courseId)
      );

      if (!alreadyEnrolled) {
        student.courses.push({
          courseId: order.courseId,
          enrolledAt: new Date(),
        });
        await student.save();
      }

      await Course.updateOne(
        {
          _id: order.courseId,
          "students.studentId": { $ne: userId },
        },
        {
          $push: {
            students: {
              studentId: userId,
              studentName: req.user.name || "",
              studentEmail: req.user.email || "",
              enrolledAt: new Date(),
            },
          },
        }
      );
    }

    return res.status(200).json({
      success: true,
      message: "Order payment updated",
      order,
    });
  } catch (err) {
    console.error("Confirm order payment error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* STUDENT — GET MY ORDERS */
exports.getMyOrders = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const orders = await Order.find({ userId })
      .populate("courseId", "title image instructor pricing")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (err) {
    console.error("Get my orders error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* STUDENT — GET SINGLE ORDER */
exports.getOrderDetails = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { orderId } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const order = await Order.findOne({ _id: orderId, userId }).populate(
      "courseId",
      "title image instructor pricing"
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (err) {
    console.error("Get order details error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};