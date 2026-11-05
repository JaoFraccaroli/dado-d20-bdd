# Assinatura do APK

`debug.keystore` é uma chave de **depuração** (senha padrão `android`), usada só para que todos os APKs gerados pelo GitHub Actions tenham a mesma assinatura. Assim, uma versão nova instala por cima da anterior no celular, sem precisar desinstalar.

Para publicar na Play Store seria preciso uma chave própria, guardada como segredo do repositório (nunca no código).
