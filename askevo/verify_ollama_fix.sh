#!/bin/bash

# Verification script for Ollama streaming fix

echo "🔍 Verifying Ollama Streaming Fix..."
echo ""

# Check if the fix was applied
if grep -q "abortSignal = null" /home/progenics-bioinfo/genomics_project/askevo_v2/askevo/src/services/ollamaService.js; then
    echo "✅ Fix applied: abortSignal parameter added"
else
    echo "❌ Fix NOT applied: abortSignal parameter missing"
    exit 1
fi

if grep -q "if (abortSignal)" /home/progenics-bioinfo/genomics_project/askevo_v2/askevo/src/services/ollamaService.js; then
    echo "✅ Fix applied: abortSignal conditional check present"
else
    echo "❌ Fix NOT applied: abortSignal check missing"
    exit 1
fi

if grep -q "fetchOptions.signal = abortSignal" /home/progenics-bioinfo/genomics_project/askevo_v2/askevo/src/services/ollamaService.js; then
    echo "✅ Fix applied: signal passed to fetch"
else
    echo "❌ Fix NOT applied: signal not passed to fetch"
    exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ All fixes verified successfully!"
echo ""
echo "🚀 Next steps:"
echo "   1. Hard refresh browser: Ctrl + Shift + R"
echo "   2. Test chat functionality"
echo "   3. Verify streaming works"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
