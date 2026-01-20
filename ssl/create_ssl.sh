
# 1. Generate a new private key
openssl genrsa -out social.key 2048

# 2. Generate a self-signed certificate (valid for 365 days in this example)
openssl req -x509 -new -sha256 -days 3650 -key social.key -out social.crt -addext "extendedKeyUsage = codeSigning"

# 3. Combine them into a PFX file
openssl pkcs12 -export -inkey social.key -in social.crt -out social.pfx

# 3. Combine them into a P12 file
openssl pkcs12 -export -in social.crt -inkey social.key -out social.p12 -macalg sha1 -certpbe PBE-SHA1-3DES -keypbe PBE-SHA1-3DES




# Get Key Information
openssl pkcs12 -in social.p12 -nokeys -info
openssl x509 -in social.p12 -noout -subject
openssl x509 -in social.crt -noout -text | grep "Extended Key Usage"


