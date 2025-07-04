# Configurar SPF, DKIM e DMARC no GoDaddy

## Passo 1: Aceder ao DNS no GoDaddy

1. Faça login em https://www.godaddy.com
2. Clique em **"My Products"**
3. Encontre **blipee.com** e clique em **"DNS"**

## Passo 2: Adicionar SPF Record

1. Clique em **"ADD"** 
2. Preencha:
   - **Type**: TXT
   - **Name**: @
   - **Value**: `v=spf1 include:_spf.google.com ~all`
   - **TTL**: 1 hour

3. Clique em **"Save"**

⚠️ **Se já existir um registo TXT com SPF**, não crie outro! Em vez disso, edite o existente.

## Passo 3: Configurar DKIM

### No Google Workspace Admin:

1. Vá para https://admin.google.com
2. Navegue: **Apps** → **Google Workspace** → **Gmail**
3. Clique em **"Authenticate email"**
4. Clique em **"GENERATE NEW RECORD"**
5. Configure:
   - **Key length**: 2048 bit
   - **Prefix selector**: google
6. Clique em **"GENERATE"**
7. **COPIE** o valor TXT (será algo longo começando com `v=DKIM1; k=rsa;...`)

### No GoDaddy:

1. Clique em **"ADD"**
2. Preencha:
   - **Type**: TXT
   - **Name**: `google._domainkey`
   - **Value**: [Cole aqui o valor DKIM copiado]
   - **TTL**: 1 hour

3. Clique em **"Save"**

### Voltar ao Google Admin:

1. Aguarde 15-30 minutos
2. Clique em **"START AUTHENTICATION"**

## Passo 4: Adicionar DMARC Record

1. No GoDaddy DNS, clique em **"ADD"**
2. Preencha:
   - **Type**: TXT
   - **Name**: `_dmarc`
   - **Value**: `v=DMARC1; p=none; rua=mailto:pedro@blipee.com`
   - **TTL**: 1 hour

3. Clique em **"Save"**

## Passo 5: Verificar Configuração

### Aguarde 15-30 minutos e verifique:

1. **SPF**: https://mxtoolbox.com/spf.aspx
   - Digite: blipee.com
   - Deve mostrar o registo SPF

2. **DKIM**: Envie um email de teste
   - Veja os headers do email
   - Procure por "DKIM-Signature"

3. **DMARC**: https://mxtoolbox.com/dmarc.aspx
   - Digite: blipee.com

## Screenshot das Configurações

No GoDaddy DNS, deve ficar assim:

```
Type | Name              | Value                                    | TTL
-----|-------------------|------------------------------------------|-----
TXT  | @                 | v=spf1 include:_spf.google.com ~all     | 1 hour
TXT  | google._domainkey | v=DKIM1; k=rsa; p=MIIBIjANBg...         | 1 hour  
TXT  | _dmarc            | v=DMARC1; p=none; rua=mailto:pedro@b... | 1 hour
```

## Tempo de Propagação

- **GoDaddy**: Normalmente propaga em 15-30 minutos
- **DKIM**: Pode demorar até 48 horas para começar a funcionar
- **Verificação**: Use https://www.mail-tester.com para testar

## Troubleshooting

### "Record already exists"
- Verifique se já existe um registo SPF
- Se sim, edite em vez de criar novo

### DKIM não funciona
- Certifique-se que copiou TODO o valor
- O valor é muito longo (várias linhas)
- Nome deve ser exatamente: `google._domainkey`

### Emails ainda vão para spam
- Demora alguns dias para Gmail reconhecer
- Continue a marcar como "não é spam"
- A reputação melhora com o tempo

## Depois de Configurar

1. **Teste imediato**: Envie email para você mesmo
2. **Marque como não spam**: Se ainda for para spam
3. **Aguarde**: A reputação demora a construir
4. **Monitorize**: Use Google Postmaster Tools

## Resultado Esperado

Depois de configurado, os emails devem:
- ✅ Ir para a inbox
- ✅ Mostrar "via blipee.com" autenticado
- ✅ Ter ícone de cadeado no Gmail
- ✅ Passar verificações de spam