## Installation

```bash
python3 -m pip --version
python3 -m pip install --user virtualenv
python3 -m venv env
source env/bin/activate
python3 -m pip install -r requirements.txt
```

On Ubuntu:

```bash
sudo apt install -y python3-pip python3.10-venv
```

## First Run

```bash
flask run
python3 mongo_main.py
python3 crawler.py
```

## Second Run

```bash
flask run
python3 crawler.py
```

## Daemonize

```bash
npm install -g pm2
pm2 start app.py --interpreter python3 --time
pm2 start crawler.py --interpreter python3 --time
```

## Restart
It will delete all data from database and re-populate it again.

```bash
devops/restart.sh
```
