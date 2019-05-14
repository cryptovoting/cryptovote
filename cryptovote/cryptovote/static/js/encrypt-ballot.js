class PublicKey {
    /**
     *
     * @param n BigInt
     * @param s BigInt
     * @param m BigInt
     */
    constructor(n, s, m) {
        this.s = s;
        this.n = n;
        this.m = m;
        this.n_s = this.n ** this.s;  // n^s
        this.n_s_1 = this.n_s * this.n;  // n^(s+1)
        this.n_s_m = this.n_s * this.m;  // n^s * m
    }

    /**
     *
     * @param m BigInt the message to encrypt
     * @return BigInt the encryption of number m
     */
    encrypt(m) {
        let r = PublicKey.get_random_below(this.n - 1n) + 1n;
        return PublicKey.pow_mod(this.n + 1, m, this.n_s_1) * PublicKey.pow_mod(r, this.n_s, this.n_s_1) % this.n_s_1
    }

    static get_random_below(n) {
        let power = 1;
        let i = 0;
        for (; power < n; i++)
            power *= 2;
        let len = Math.ceil(i / 8);

        // cryptographically secure random
        let rands = crypto.getRandomValues(new Uint8Array(len));

        const byte = 2n ** 8n;
        let build = 0n;
        let f = 1n;
        for (let i = 0; i < len; i++) {
            build += BigInt(rands[i]) * f;
            f *= byte;
        }
        return build % n;
    }

    /**
     * Performs exponentiation b**e modulo m
     * @param b BigInt base
     * @param e BigInt exponent
     * @param m BigInt modulus
     */
    static pow_mod(b, e, m) {
        let res = 1n;

        b = b % m;
        while (e > 0) {
            // If y is odd, multiply x with result
            if (e & 1n)
                res = (res * b) % m;
            e = e >> 1n;
            b = (b * b) % m;
        }
        return res;
    }
}

function submitForm() {
    try {
        const $form = $("form#ballot-form");

        let ballot = $form.find("input[name=ballot]");
        let candidates = ballot.val().split(",");
        const n = $form.find("input[name=key_n").val().trim();
        const s = $form.find("input[name=key_s").val().trim();

        let publicKey = new PublicKey(BigInt(n), BigInt(s));
        let preferences = [];
        for (let i = 0n; i < candidates.length; i++) {
            preferences.push({
                preference: publicKey.encrypt(i).toString(),
                candidate: candidates[i]
            });
        }
        preferences.sort((x, y) => x.candidate > y.candidate ? 1 : (x.candidate < y.candidate ? -1 : 0));
        ballot.val(JSON.stringify(preferences));
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }


}