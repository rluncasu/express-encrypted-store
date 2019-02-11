# Express server boilerplate with ecncrypted storage

### included:
- redis
- logger with pretty streaming to terminal
- api call parameter validation

### getting started

Spin up the redis container (exposes port 3001 on the host so make sure it's available)
```
docker-compose up -d
```

Start the api server (listens on port 3000 so make sure that's available too)
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

##### retrieve value(s) from the store (id param supports [wildcards](https://redis.io/commands/keys))
```
curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"id":"jobs-*", "decryption_key":"key-one"}' \
  http://localhost:3000/search
```
