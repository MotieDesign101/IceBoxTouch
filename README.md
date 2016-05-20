# Icebox Touch Client

## Startup
Im crontab des Pi ist folgendes eingetragen:

    @reboot /home/mrfreeze/startbrowser.sh

Au dem Pi liegt ein bash-script, das sieht so aus:

    #!/bin/bash

    nohup nodejs gpiotest/gpiotest.js &> /dev/null &
    cd /var/www
    npm start &
    cd
    xte 'sleep 50'
    xte 'sleep 10' 'key F11' & epiphany-browser http://localhost:8082

gpiotest hat mit dem Kram hier nichts zu tun, der Rest startet diesen Dienst und dann den Browser in fullscreen.

### Testen

* Code Auschecken.
* npm install
* npm start

Der Dienst sollte nun die IP des im Netzwerk laufenden icebox-service finden und in der Konsole anzeigen, danach ist der Dienst unter localhost:8082 zu finden.

## License
MIT
