var admin = require("firebase-admin");

if (admin.apps.length === 0) {
  var serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

exports.handler = async function(event, context) {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };

  try {
    const data = JSON.parse(event.body);
    const db = admin.firestore();
    const snapshot = await db.collection('push_tokens').get();
    
    if (snapshot.empty) return { statusCode: 200, body: JSON.stringify({ message: "Nenhum cliente." }) };

    const tokens = snapshot.docs.map(doc => doc.data().token);
    
    // 🚨 AQUI ESTÁ A CORREÇÃO PARA ANDROID 🚨
    const message = {
      notification: { 
        title: data.title, 
        body: data.body 
      },
      // Configuração específica para acordar o Android
      android: {
        priority: 'high',
        notification: {
          sound: 'default',
          click_action: data.link || 'https://loja3marias.netlify.app'
        }
      },
      // Configuração para Web (PC/iPhone)
      webpush: { 
        headers: {
          Urgency: "high"
        },
        fcm_options: { 
          link: data.link || 'https://loja3marias.netlify.app' 
        } 
      },
      tokens: tokens
    };

    const response = await admin.messaging().sendEachForMulticast(message);
    return { statusCode: 200, body: JSON.stringify({ success: true, count: response.successCount }) };

  } catch (error) {
    console.error(error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
