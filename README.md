# plann.er
<div style="display: flex; justify-content: center; margin-bottom: 12px;">
    <img src="./assets/image.png" alt="plann.er" width="200px" />
</div>

<p align="center">Projeto desenvolvido durante a NLW Journey da Rocketseat. 🚀</p>

## Índice
- <a href="#sobre">Sobre</a>
- <a href="#tecnologias-utilizadas">Tecnologias utilizadas</a>
- <a href="#instalação">Instalação</a>

## Sobre

Plann.er é um aplicativo mobile para Android e iOS que facilita o planejamento de viagens em grupo, centralizando envio de convites por e-mail, organização de atividades e análise de sugestões através de links. Permite criar atividades durante o período da viagem, anexar links para comparações de serviços oferecendo uma uma interface amigável. Proporciona uma experiência colaborativa e eficiente para uma viagem memorável.

![create-trip](./assets/trip.png)
![email](./assets/email.png)
![list-activities](./assets/list-activities.png)
![create-activity](./assets/create-activity.png)
![list-links-participants](./assets/list-links-participants.png)
![create-link](./assets/create-link.png)

## Tecnologias Utilizadas
### Mobile

<div style="display: flex; justify-content: between; gap: 8px; align-items: center; margin-bottom: 12px;">
    <img src="https://miro.medium.com/v2/resize:fit:1400/1*OwTgC3_fZg3lUg7Nc17F8Q.png" alt="Expo" height="24px"/>
    <img src="https://miro.medium.com/v2/resize:fit:1200/1*safAvjgR68qpQCreDTOcYA.png" alt="React Native" height="24px" />
    <img src="https://seeklogo.com/images/T/tailwind-css-logo-89E99D7181-seeklogo.com.png" alt="TailwindCSS" height="24px" />
    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVTiv9xCX-8I2toyImxDa3izM_6HtvS5CHgIJ2LFbzPhTEZebKKH2mFbcWOvArwu62SA&usqp=CAU" alt="Lucide Icons" height="24px" />
    <img src="https://raw.githubusercontent.com/colinhacks/zod/HEAD/logo.svg" alt="Zod" height="24px" />
    <img src="https://user-images.githubusercontent.com/17680888/39081119-3057bbe2-456e-11e8-862c-646133ad4b43.png" alt="dayjs" height="24px" />
</div>

### Server

<div style="display: flex; justify-content: between; gap: 8px; align-items: center; margin-bottom: 12px;">
    <img src="https://cdn.pixabay.com/photo/2015/04/23/17/41/node-js-736399_960_720.png" alt="Node.js" height="48px" />
    <img src="https://github.com/fastify/graphics/raw/HEAD/fastify-landscape-outlined.svg" alt="Fastify" height="24px" />
    <img src="https://raw.githubusercontent.com/colinhacks/zod/HEAD/logo.svg" alt="Zod" height="24px" />
    <img src="https://seeklogo.com/images/P/prisma-logo-BE375CFB25-seeklogo.com.png" alt="Prisma" height="24px" />
    <img src="https://raw.githubusercontent.com/nodemailer/nodemailer/master/assets/nm_logo_200x136.png" alt="Nodemailer" height="24px" />
    <img src="https://user-images.githubusercontent.com/17680888/39081119-3057bbe2-456e-11e8-862c-646133ad4b43.png" alt="dayjs" height="24px" />
</div>

## Instalação
### Server
Para instalar todas as dependecias, rode o comando na pasta /server do projeto plann.er: 
```bash
    npm install
```

Inicialize o banco de dados do servidor através do seguinte comando:
```bash
    npm run db:init
```

Para inicializar o servidor em modo de desenvolvimento, rode o comando:
```bash
    npm run dev
```

Para abrir o banco de dados através do Studio da biblioteca Prisma, rode o comando: 
```bash
    npm run db:studio
```

### Mobile
Para instalar todas as dependecias, rode o comando na pasta /mobile do projeto plann.er: 
```bash
    npm install
```

Antes de inicializar a aplicação, coloque o IP local da sua máquina no seguinte arquivo `/mobile/src/server/api.ts`:

<div style="display: flex; justify-content: center;margin-bottom: 12px;">
    <img src="./assets/ip-config.png" alt="ip-config" />
</div>

Para inicializar o servidor mobile, rode o comando: 
```bash
    npm start
```

Caso já use o emulador do Android Studio, deixe o emulador inicializado e tecle o comando `a` em seu terminal para abrir o aplicativo. 

É possível também, baixar o app Expo Go em sua loja de aplicativos (Apple Store ou PlayStore) e scannear o QRCode gerado a partir do comando `npm start` para abrir o aplicativo no celular. Portanto, é importante estar conectado na mesma rede da máquina onde o servidor do projeto está rodando.  