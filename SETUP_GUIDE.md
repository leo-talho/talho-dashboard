# 🚀 Guia de Setup Rápido - Talho Dashboard no Vercel

**Tempo estimado: 15 minutos**

---

## PASSO 1: Preparar os arquivos

1. **Baixe ou copie** todos os arquivos deste projeto:
   - `pages/index.js`
   - `package.json`
   - `next.config.js`
   - `.gitignore`
   - `README.md`
   - `vercel.json`

2. Coloque-os em uma pasta chamada `talho-dashboard` no seu computador

---

## PASSO 2: Criar conta no GitHub (5 min)

1. Acesse **https://github.com/signup**
2. Preencha:
   - Email: seu email pessoal ou leo@talho.com.br
   - Username: ex: `leo-talho` (não use espaços)
   - Senha: algo seguro (ex: TalhoCarnes2026#)
3. Clique **Create account**
4. Verifique o email (GitHub envia um link)
5. ✅ Conta criada

---

## PASSO 3: Criar repositório no GitHub (3 min)

1. Logado no GitHub, clique no **+** (canto superior direito)
2. **New repository**
3. Nome do repositório: `talho-dashboard`
4. Descrição (opcional): "Talho Carnes KPI Dashboard"
5. ☑️ Selecione **Public** (não precisa gastar money)
6. Clique **Create repository**

---

## PASSO 4: Enviar arquivos para o repositório (3 min)

1. Na página do repositório, clique em **Add file** (verde, lado direito)
2. **Upload files**
3. **Arraste todos os arquivos** da pasta `talho-dashboard` para a caixa (ou clique e selecione)
4. Clique em **Commit changes** (no final da página)

✅ Arquivos enviados para GitHub

---

## PASSO 5: Criar conta no Vercel e fazer deploy (4 min)

1. Acesse **https://vercel.com/signup**
2. Clique em **Continue with GitHub** (não precisa preencher nada)
3. Autorize Vercel a acessar seu GitHub (botão azul)
4. Você será redirecionado para Vercel
5. Clique em **New Project** (ou **Import Project**)
6. Procure por `talho-dashboard` na lista
7. Clique em **Import**
8. Deixe as configs padrão (Vercel já detecta que é Next.js)
9. Clique em **Deploy** (botão azul)

⏳ Vercel está fazendo deploy... (2-3 minutos)

✅ Quando ver "Congratulations! Your site is live!", é a hora!

---

## PASSO 6: Testar o acesso

1. Clique no link da URL (algo como `https://talho-dashboard.vercel.app`)
2. Login com:
   - Email: `leo@talho.com.br`
   - Senha: `talho2026`
3. Você deve ver o dashboard com os dados de teste

**Parabéns! 🎉 Seu dashboard está ao vivo!**

---

## PASSO 7: Atualizar senhas (IMPORTANTE - faça agora!)

1. GitHub → repositório `talho-dashboard`
2. Clique no arquivo `pages/index.js`
3. Clique no ✏️ (editar)
4. Procure por `const validUsers = {` (por volta da linha 24)
5. Mude as senhas:
   ```javascript
   'leo@talho.com.br': 'SUA_NOVA_SENHA_SEGURA',
   'mauricio@talho.com.br': 'SUA_NOVA_SENHA_SEGURA',
   'sergio@talho.com.br': 'SUA_NOVA_SENHA_SEGURA',
   ```
6. Clique em **Commit changes**
7. Espere 2 minutos (Vercel redeploy automático)
8. Teste login com a nova senha

**⚠️ Compartilhe as senhas com a equipe de forma segura** (WhatsApp, email privado, etc)

---

## PASSO 8: Atualizar dados mensalmente

**A partir do dia 5 de cada mês (quando Analytics.xlsx tem os dados):**

1. Abra `Analytics.xlsx`
2. Abra a aba `KPI's Dashboard`
3. Copie os números de **YTD 2026** e **YTD 2025**

4. GitHub → `talho-dashboard` → `pages/index.js` → ✏️
5. Procure por `const kpiData = {` (linha ~24)
6. Atualize os valores em `YTD:`
   ```javascript
   YTD: {
     current: { value: NOVO_VALOR_2026, prev: NOVO_VALOR_2025 },
     // ... etc
   }
   ```

7. Scroll para baixo e clique **Commit changes**
8. Espere 2 min (Vercel auto-deploy)
9. Teste no dashboard

**Pronto! Dados atualizados! ✅**

---

## Se der erro...

| Erro | Solução |
|------|---------|
| "Não consigo fazer upload no GitHub" | Verifique se você está logado (seu avatar aparece no topo direito?) |
| "Deployment falhou no Vercel" | Clique em "Deployments" e veja a mensagem de erro (geralmente é arquivo faltando) |
| "Senhas não funcionam após atualizar" | Aguarde 2-3 min (Vercel ainda está fazendo deploy). Limpe cache (Cmd+Shift+R) |
| "Dashboard mostra dados velhos" | Limpe o cache do navegador e recarregue |

---

## Links rápidos

- **Dashboard:** https://talho-dashboard.vercel.app
- **GitHub:** https://github.com/SEU_USERNAME/talho-dashboard
- **Vercel:** https://vercel.com/dashboard
- **Documentação:** README.md neste repositório

---

## Checklist final

- [ ] GitHub account criada e verificada
- [ ] Repositório `talho-dashboard` criado no GitHub
- [ ] Arquivos enviados para GitHub
- [ ] Vercel conectado ao GitHub
- [ ] Dashboard publicado em https://talho-dashboard.vercel.app
- [ ] Login funciona
- [ ] Senhas alteradas para senhas seguras
- [ ] Equipe tem as novas senhas
- [ ] Primeira atualização de dados agendada para dia 5 do próximo mês

---

**Qualquer dúvida: leo@talho.com.br**

**Dashboard Version: 1.0.0 - Phase 1 (Financial KPIs)**
