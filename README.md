# Cryptovote

Web interface for homomorphically encrypted single transferable vote elections.

## Web Interface

To run an election via the web interface, run the following commands:

```bash
cd cryptovote
pip install -r requirements.txt
python -m flask run
```

Prior to initially running the web interface, the file `.env.example` should be copied into a new file named `.env` with the desired values set. Also note that Chrome seems to be the only browser that supports DNS resolution for subdomains of the localhost, so for development Chrome must be used for portions of the site that use subdomains. Furthermore, webauthn requires that the domain being used has at least two parts (i.e. two strings separated by a period), so be sure to use a development root server name that looks something like `cryptovote.localhost:5000` instead of just `localhost:5000`Finally, if actually deployed on a non-localhost server HTTPS must be used in order for WebAuthn to work.
