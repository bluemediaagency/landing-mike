#!/bin/bash

# Script para desplegar automáticamente a GitHub
# Uso: ./deploy.sh "mensaje del commit"

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🚀 Iniciando despliegue automático...${NC}"

# Verificar si hay cambios
if [[ -z $(git status --porcelain) ]]; then
    echo -e "${YELLOW}⚠️  No hay cambios para subir${NC}"
    exit 0
fi

# Usar mensaje del commit proporcionado o uno por defecto
COMMIT_MESSAGE=${1:-"Actualización automática $(date '+%Y-%m-%d %H:%M:%S')"}

echo -e "${YELLOW}📝 Agregando archivos...${NC}"
git add .

echo -e "${YELLOW}💾 Creando commit: ${COMMIT_MESSAGE}${NC}"
git commit -m "$COMMIT_MESSAGE"

echo -e "${YELLOW}📤 Subiendo a GitHub...${NC}"
git push origin main

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Despliegue exitoso!${NC}"
    echo -e "${GREEN}🌐 Tu landing page se actualizará en unos minutos${NC}"
else
    echo -e "${RED}❌ Error en el despliegue${NC}"
    exit 1
fi

echo -e "${GREEN}🎉 ¡Listo! BlueMedia actualizado${NC}"
