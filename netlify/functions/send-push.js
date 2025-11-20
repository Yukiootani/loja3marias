var admin = require("firebase-admin");

// Verifica se já conectou antes para não dar erro
if (admin.apps.length === 0) {
  // Pega a chave mestra que vamos colocar no Netlify
  var serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

exports.handler = async function(event, context) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const data = JSON.parse(event.body);
    const { title, body, link } = data;

    // 1. Busca todos os tokens no banco de dados
    const db = admin.firestore();
    const snapshot = await db.collection('push_tokens').get();
    
    if (snapshot.empty) {
      return { statusCode: 200, body: JSON.stringify({ message: "Nenhum cliente cadastrado." }) };
    }

    const tokens = snapshot.docs.map(doc => doc.data().token);

    // 2. Prepara a mensagem
    const message = {
      notification: {
        title: title,
        body: body
      },
      webpush: {
        fcm_options: {
          link: link || 'https://loja3marias.netlify.app'
        }
      },
      tokens: tokens
    };

    // 3. Envia para todos (Multicast)
    const response = await admin.messaging().sendEachForMulticast(message);
    
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true, 
        successCount: response.successCount, 
        failureCount: response.failureCount 
      })
    };

  } catch (error) {
    console.error("Erro no envio:", error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
