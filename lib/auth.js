const { time } = require('console');
const crypto = require('crypto');

const header = {
    "alg": "HS256",
	"typ": "JWT"
}

class auth {
    // 生成签名
    calcSignature(header, payload ,key) {
        const hmac = crypto.createHmac('sha256', key);
        const signature = `${header}.${payload}.`;
        return hmac.update(signature).digest('hex');
    }

    CreateAuthToken(key, projectName) {
        const timestamp = (+new Date() / 1000).toFixed(0);
        const payload = {
            "project_name": projectName,
            "expires_at": Number(timestamp + 60),
            "access_type": "SDK"
        }

        const headerBytes = JSON.stringify(header);
        const payloadBytes = JSON.stringify(payload);

        const headerStr = Buffer.from(headerBytes).toString("base64");
        const payloadStr = Buffer.from(payloadBytes).toString("base64");
        const signature = this.calcSignature(headerStr, payloadStr, key);

        return `${headerStr}.${payloadStr}.${signature}`;
    }
}

module.exports = auth;