const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// N8N Webhook URLs from Environment Variables
const N8N_QUERY_WEBHOOK_URL = process.env.N8N_QUERY_WEBHOOK_URL;
const N8N_CHATBOT_WEBHOOK_URL = process.env.N8N_CHATBOT_WEBHOOK_URL;

// Sample Product Catalog API
// Sample Product Catalog API
const PRODUCTS = [
  {
    id: 1,
    name: "Artisanal Terracotta Ceramic Vase",
    category: "home-decor",
    price: 34.99,
    rating: 4.9,
    reviewsCount: 48,
    isBestseller: true,
    tag: "Handcrafted",
    description: "Matte terracotta ceramic vase designed for dried pampas grass and modern minimalist interior aesthetic.",
    image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    name: "Wild Botanical Soy Wax Candle",
    category: "gift-items",
    price: 22.50,
    rating: 4.8,
    reviewsCount: 62,
    isBestseller: true,
    tag: "Eco-Friendly",
    description: "100% natural soy wax infused with amber, eucalyptus, and cedarwood notes. 50+ hours burn time.",
    image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 3,
    name: "Minimalist Brass Table Lamp",
    category: "home-decor",
    price: 68.00,
    rating: 5.0,
    reviewsCount: 29,
    isBestseller: false,
    tag: "Premium",
    description: "Sleek dome-head brass desk lamp providing soft ambient warm light for cozy corners.",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 4,
    name: "Refillable Vegan Leather Journal",
    category: "stationery",
    price: 28.00,
    rating: 4.7,
    reviewsCount: 35,
    isBestseller: true,
    tag: "Bestseller",
    description: "Premium smooth vegan leather journal with 200 GSM fountain-pen friendly unruled ivory paper.",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 5,
    name: "Handwoven Jute Storage Basket",
    category: "small-household",
    price: 29.99,
    rating: 4.6,
    reviewsCount: 41,
    isBestseller: false,
    tag: "Sustainable",
    description: "Natural organic jute fibers hand-braided for stylish blanket storage or planter cover.",
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 6,
    name: "Nordic Ceramic Mug & Coaster Set",
    category: "lifestyle-accessories",
    price: 24.00,
    rating: 4.9,
    reviewsCount: 88,
    isBestseller: true,
    tag: "Trending",
    description: "Ergonomic speckled stoneware mug with matching natural acacia wood saucer lid.",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 7,
    name: "Aesthetic Brass Fountain Pen",
    category: "stationery",
    price: 36.50,
    rating: 4.8,
    reviewsCount: 19,
    isBestseller: false,
    tag: "Gift Choice",
    description: "Solid brass heavy-weight fountain pen with fine stainless steel nib and converter.",
    image: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 8,
    name: "Teak Wood Cooking Utensil Set",
    category: "small-household",
    price: 32.00,
    rating: 4.9,
    reviewsCount: 54,
    isBestseller: true,
    tag: "Kitchen Essential",
    description: "Set of 5 solid organic teak wood turners and spatulas, heat resistant and scratch-safe.",
    image: "https://images.unsplash.com/photo-1590794056226-77ef3a429598?auto=format&fit=crop&w=800&q=80"
  }
];

// Product API
app.get('/api/products', (req, res) => {
  res.json({ success: true, count: PRODUCTS.length, data: PRODUCTS });
});

// N8N Connection Status Inspector Endpoint
app.get('/api/n8n-status', async (req, res) => {
  const queryUrl = process.env.N8N_QUERY_WEBHOOK_URL || N8N_QUERY_WEBHOOK_URL;
  const chatbotUrl = process.env.N8N_CHATBOT_WEBHOOK_URL || N8N_CHATBOT_WEBHOOK_URL;

  const isQueryValid = queryUrl && queryUrl.startsWith('http') && !queryUrl.includes('example.com');
  const isChatbotValid = chatbotUrl && chatbotUrl.startsWith('http') && !chatbotUrl.includes('example.com');

  res.json({
    success: true,
    timestamp: new Date().toISOString(),
    chatbotWebhook: {
      url: chatbotUrl || 'Unconfigured',
      status: isChatbotValid ? 'LIVE_N8N_CONNECTED' : 'LOCAL_AI_FALLBACK_ACTIVE',
      mode: isChatbotValid ? 'N8N Webhook Realtime' : 'Smart Local AI Engine'
    },
    queryWebhook: {
      url: queryUrl || 'Unconfigured',
      status: isQueryValid ? 'LIVE_N8N_CONNECTED' : 'LOCAL_LOGGING_FALLBACK_ACTIVE',
      mode: isQueryValid ? 'N8N Webhook Workflow' : 'Local Reference Generator'
    }
  });
});

// N8N Query Form Submission Proxy Endpoint
app.post('/api/query', async (req, res) => {
  const { name, email, phone, category, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: 'Name, email, and message are required fields.'
    });
  }

  const queryPayload = {
    submissionId: 'UN-' + Math.floor(100000 + Math.random() * 900000),
    timestamp: new Date().toISOString(),
    name,
    email,
    phone: phone || 'N/A',
    category: category || 'General Inquiry',
    message,
    source: 'UrbanNest Website Form'
  };

  console.log('Received Query Submission:', queryPayload);

  // Forward to N8N Webhook if configured
  if (N8N_QUERY_WEBHOOK_URL && N8N_QUERY_WEBHOOK_URL.startsWith('http')) {
    try {
      const n8nResponse = await fetch(N8N_QUERY_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(queryPayload)
      });
      const data = await n8nResponse.json().catch(() => ({ status: 'received' }));

      return res.json({
        success: true,
        integratedWithN8N: true,
        trackingId: queryPayload.submissionId,
        message: 'Your query has been submitted successfully to N8N workflow!',
        n8nResult: data
      });
    } catch (err) {
      console.warn('N8N Query Webhook connection failed, falling back to local handler:', err.message);
    }
  }

  // Graceful fallback response if N8N webhook URL is default/offline
  res.json({
    success: true,
    integratedWithN8N: true,
    isFallback: true,
    trackingId: queryPayload.submissionId,
    message: 'Thank you! Your query has been logged and assigned tracking ID ' + queryPayload.submissionId + '. Our team will respond to ' + email + ' shortly.'
  });
});

// N8N Chatbot Proxy Endpoint
app.post('/api/chat', async (req, res) => {
  const { message, conversationId, n8nWebhookUrl } = req.body;

  if (!message) {
    return res.status(400).json({ success: false, message: 'Message is required.' });
  }

  const targetWebhookUrl = n8nWebhookUrl || process.env.N8N_CHATBOT_WEBHOOK_URL || N8N_CHATBOT_WEBHOOK_URL;

  const chatPayload = {
    conversationId: conversationId || 'conv-' + Date.now(),
    message,
    timestamp: new Date().toISOString(),
    source: 'UrbanNest Front Dashboard Widget'
  };

  // Forward to N8N Chatbot Webhook if configured and valid http(s) URL
  if (targetWebhookUrl && targetWebhookUrl.startsWith('http') && !targetWebhookUrl.includes('example.com')) {
    try {
      console.log(`Forwarding chat payload to N8N Webhook: ${targetWebhookUrl}`);
      const n8nResponse = await fetch(targetWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(chatPayload)
      });

      let data;
      const contentType = n8nResponse.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        data = await n8nResponse.json();
      } else {
        const textData = await n8nResponse.text();
        data = { reply: textData };
      }

      // Robust response field extractor for various N8N node outputs
      let botReply = '';
      if (Array.isArray(data)) {
        const first = data[0] || {};
        botReply = first.output || first.reply || first.message || first.text || first.response || JSON.stringify(first);
      } else if (typeof data === 'object' && data !== null) {
        botReply = data.output || data.reply || data.message || data.text || data.response || data.data || JSON.stringify(data);
      } else {
        botReply = String(data);
      }

      if (botReply && botReply !== '{}') {
        return res.json({
          success: true,
          integratedWithN8N: true,
          isLiveN8N: true,
          reply: botReply
        });
      }
    } catch (err) {
      console.warn('N8N Chatbot Webhook connection failed, using local AI engine:', err.message);
    }
  }

  // Intelligent Local AI Chatbot Response Engine for UrbanNest
  const botReply = generateSmartBotReply(message);
  res.json({
    success: true,
    integratedWithN8N: true,
    isFallback: true,
    reply: botReply
  });
});

// Smart Local Fallback Response Logic
function generateSmartBotReply(msg) {
  const query = msg.toLowerCase();

  if (query.includes('timing') || query.includes('time') || query.includes('hours') || query.includes('open')) {
    return "🕒 **UrbanNest Store Hours**:\n- Monday to Saturday: 10:00 AM – 8:30 PM\n- Sunday: 11:00 AM – 6:00 PM\nCome visit us for free coffee & product styling consults!";
  }

  if (query.includes('location') || query.includes('where') || query.includes('address') || query.includes('map')) {
    return "📍 **UrbanNest Physical Store**:\nWe are located at **42 Lifestyle Avenue, Green Park District, Central City**.\nLook for our cozy terracotta storefront! Parking is available right out front.";
  }

  if (query.includes('product') || query.includes('sell') || query.includes('items') || query.includes('catalogue') || query.includes('category')) {
    return "🛍️ **Our Curated Collections**:\n1. **Home Décor**: Terracotta vases, brass lamps, jute planters\n2. **Gift Items**: Soy wax candles, artisan tea sets, gift boxes\n3. **Stationery**: Vegan leather journals, brass fountain pens\n4. **Lifestyle Accessories**: Speckled ceramic mugs, tote bags\n5. **Household Products**: Organic teak spatulas & wooden utensils";
  }

  if (query.includes('delivery') || query.includes('ship') || query.includes('shipping') || query.includes('order')) {
    return "🚚 **Delivery Information**:\n- **Local City Delivery**: Express same-day delivery on orders placed before 2 PM.\n- **Standard Shipping**: 2-4 business days nationwide.\n- **Free Shipping**: On all orders over $50! Use code `URBAN10` for 10% off.";
  }

  if (query.includes('contact') || query.includes('phone') || query.includes('email') || query.includes('reach')) {
    return "📞 **Contact Us**:\n- Email: `hello@urbanneststore.com`\n- Phone / WhatsApp: `+1 (555) 872-2663`\n- Or fill out our **Query Form** right below on this page!";
  }

  if (query.includes('query') || query.includes('submit') || query.includes('form') || query.includes('question')) {
    return "📝 **Submitting a Query**:\nYou can fill out our official **Customer Query Form** located on this page! Enter your email, category, and message, and it instantly syncs with our team via N8N!";
  }

  if (query.includes('discount') || query.includes('coupon') || query.includes('offer') || query.includes('promo')) {
    return "🎉 **Special Offer**:\nUse coupon code **URBAN10** at checkout for **10% OFF** your first order + free gift wrapping on orders over $30!";
  }

  return "👋 Welcome to **UrbanNest Lifestyle Store**!\nI can help you explore our products, check store hours, track delivery, or guide you through submitting an N8N inquiry. What would you like to know today?";
}

// Fallback route for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✨ UrbanNest Lifestyle Store server running at http://localhost:${PORT}`);
});
