# CRITICAL ISSUES & FIXES - Priority Order

## 1. BACKEND CRASHES ❌
**Issue**: Backend crashes with "Failed running 'server.js'"
**Root Cause**: Unknown - need to check unhandled errors
**Fix**: Add better error logging (already done)  
**Status**: Needs verification

## 2. ARCHIVED SESSIONS NOT FILTERED ✅ FIXED
**Issue**: Deleted chats still appear in sidebar
**Root Cause**: GET /sessions query doesn't filter `is_archived = FALSE`
**Fix**: Added `AND is_archived = FALSE` to WHERE clause
**Status**: FIXED - backend will auto-restart

## 3. SESSION TITLES MISSING/GENERIC ⏳
**Issue**: Chat titles show "Chat - 11/29/2025" instead of first message
**Root Cause**: Title update logic in POST /messages might not be triggering
**Fix**: Already implemented - verify it's working
**Status**: Should work after backend restart

## 4. UI OVERLAP IN CHATAREA ❌
**Issue**: Everything overlaps in ChatArea
**Root Cause**: Possible z-index or positioning issues
**Diagnosis Needed**: 
- Check if `.input-area-wrapper` (position: absolute) conflicts with `.ai-conversation-content`
- Check if `.connection-status` (position: absolute) overlaps
**Fix**: Review ChatArea structure and CSS

## 5. LOGIN FAILURES ❌
**Issue**: Login not working properly
**Root Cause**: Could be related to backend crashes OR 401 handling
**Fix**: Backend needs to stay online first
**Status**: Depends on fixing #1

## 6. BLANK INDEX.HTML REDIRECT ❌
**Issue**: Page sometimes goes to blank index.html
**Root Cause**: React Router not catching routes OR build issue
**Diagnosis**: Check if this happens only on backend crash
**Fix**: Ensure ProtectedRoute redirects properly
