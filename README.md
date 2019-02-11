# Express key-value store boilerplate with encrypted storage
#### check the Redis version [here](https://github.com/rluncasu/express-encrypted-store/tree/redis)

### included:
- mongodb-memory-server
- logger with pretty streaming to terminal
- api call parameter validation

#### getting started
The api listens on port 3000 so make sure you have it available

```
npm i
npm start
```

##### add a value to the store
```
curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"id":"jobs-sales-rep","value":"lorem ipsum", "encryption_key":"key-one"}' \
  http://localhost:3000/add
```

##### retrieve value(s) from the store (id param supports '*' wildcard)
```
curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"id":"jobs-*", "decryption_key":"key-one"}' \
  http://localhost:3000/search
```