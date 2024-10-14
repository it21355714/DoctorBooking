import {db} from '../config/db.js'; // Firestore instance


const generatePaymentId = async () => {
    const paymentsSnapshot = await db.collection('payments').get();
    const paymentIds = paymentsSnapshot.docs.map(doc => doc.data().paymentId);

    // Extract numeric part and find the highest number
    const maxId = paymentIds
        .map(id => parseInt(id.replace('PAY', '')))
        .reduce((max, curr) => (curr > max ? curr : max), 0);

    // Generate new payment ID
    const newId = `PAY${String(maxId + 1).padStart(3, '0')}`;
    return newId;
};

// export const createPayment = async (req, res) => {
//     const { userId, patientId } = req.body;

//     // Validate required fields
//     if (!userId || !patientId) {
//         return res.status(400).send('Missing required fields.');
//     }

//     try {
//         // Fetch the appointment related to the patientId
//         const appointmentSnapshot = await db.collection('appointments').where('patientId', '==', patientId).get();
        
//         if (appointmentSnapshot.empty) {
//             return res.status(404).send('No appointment found for the given patient ID.');
//         }

//         // Assuming that a patient only has one appointment for simplicity
//         const appointmentData = appointmentSnapshot.docs[0].data();

//         // Extract consultation fees from the appointment
//         const consultationFees = appointmentData.consultationFees;

//         if (!consultationFees) {
//             return res.status(400).send('Consultation fees not found for the appointment.');
//         }

//         // Generate a new payment ID
//         const paymentId = await generatePaymentId();

//         const newPayment = {
//             paymentId,
//             userId,
//             patientId,
//             amount: consultationFees, // Use consultation fees as the payment amount
//             date: new Date().toISOString(),
//             status: 'Completed',
//         };

//         // Add the new payment to the database
//         await db.collection('payments').add(newPayment);

//         res.status(201).json({ message: `Payment created with ID: ${paymentId}`, paymentId, consultationFees });
//     } catch (error) {
//         console.error('Error creating payment: ', error);
//         res.status(500).send('Error creating payment');
//     }
// };


export const createPayment = async (req, res) => {
    const userId = req.userId; // Get userId from the request object
    const { patientId } = req.body;

    // Validate required fields
    if (!patientId) {
        return res.status(400).json({ error: 'Missing required fields.' });
    }


    try {
        // Fetch the appointment related to the patientId
        const appointmentSnapshot = await db.collection('appointments').where('patientId', '==', patientId).get();
        
        if (appointmentSnapshot.empty) {
            return res.status(404).json({ error: 'No appointment found for the given patient ID.' });
        }

        // Assuming that a patient only has one appointment for simplicity
        const appointmentData = appointmentSnapshot.docs[0].data();

        // Extract consultation fees from the appointment
        const consultationFees = appointmentData.consultationFees;

        if (!consultationFees) {
            return res.status(400).json({ error: 'Consultation fees not found for the appointment.' });
        }

        // Generate a new payment ID
        const paymentId = await generatePaymentId();

        const newPayment = {
            paymentId,
            userId,
            patientId,
            amount: consultationFees, // Use consultation fees as the payment amount
            date: new Date().toISOString(),
            status: 'Completed',
        };

        // Add the new payment to the database
        await db.collection('payments').add(newPayment);

        return res.status(201).json({
            message: `Payment created successfully.`,
            paymentId,
            consultationFees,
        });
    } catch (error) {
        console.error('Error creating payment: ', error);
        return res.status(500).json({ error: 'Error creating payment.', details: error.message });
    }
};

export const getPayments = async (req, res) => {
    try {
        const paymentsSnapshot = await db.collection('payments').get();

        // Map documents to the desired payment data structure
        const payments = paymentsSnapshot.docs.map(doc => {
            const paymentData = doc.data();

            return {
                paymentId: paymentData.paymentId,
                userId: paymentData.userId,
                patientId: paymentData.patientId,
                amount: paymentData.amount, // This holds the consultation fees from the appointment
                date: paymentData.date,
                status: paymentData.status,
            };
        });

        res.status(200).json(payments);
    } catch (error) {
        console.error('Error fetching payments: ', error);
        res.status(500).send('Error fetching payments');
    }
};

export const getPaymentById = async (req, res) => {
    const { id } = req.params;

    try {
        const paymentDoc = await db.collection('payments').doc(id).get();

        if (!paymentDoc.exists) {
            return res.status(404).send('Payment not found.');
        }

        res.status(200).json(paymentDoc.data());
    } catch (error) {
        console.error('Error fetching payment: ', error);
        res.status(500).send('Error fetching payment');
    }
};

export const updatePayment = async (req, res) => {
    const { id } = req.params;
    const { userId, patientId, amount, date, status } = req.body;

    try {
        // Update payment document
        await db.collection('payments').doc(id).update({
            userId,
            patientId,
            amount,
            date,
            status
        });

        res.status(200).send('Payment updated successfully.');
    } catch (error) {
        console.error('Error updating payment: ', error);
        res.status(500).send('Error updating payment');
    }
};


export const deletePayment = async (req, res) => {
    const { id } = req.params;

    try {
        await db.collection('payments').doc(id).delete();
        res.status(200).send('Payment deleted successfully.');
    } catch (error) {
        console.error('Error deleting payment: ', error);
        res.status(500).send('Error deleting payment');
    }
};
