## Run ##

1.   **objectid2.sql** - for a user ID function generate_object_id
2.  **users.sql** - the users of this site(table "busers")
3. **pwd-reset.sql** - password routine
4. **email-validate.sql** - email validations
5. **articles.sql** - some articles for a blog on this site 
6. **albums.sql** - photo albums in uploads directory(for a blog)
8. **images.sql** - images in uploads directory(for a blog)

9. **banners.sql** - some thing like advertising system managment(banners)
10. **ban_act.sql** - active(working) banners at the moment
11. **bitpay-info.sql** - for callbacks purposes from bitpays site
12. **transfer.sql** - who whom gives one's tokens / trigger to busers.items to update amount of tokens
13. **seats.sql** - when each publisher starts and stops his live video stream and what type is this stream: for everyone(mediasoup serverside webRTC) or for a particular person
(webRTC)
14. **cards.sql** - save actual bitcoin addres of a user(publisher) for payouts(if his tokens > 1000) on his address

15. **aud_team.sql** - an archive of team's people
16. **team.sql** - team(admins, moderators etc)
17. **banned_users.sql** - archive for the banned users
18. **abuse.sql** - abuse notes for an admins

19. **bitaps_cb.sql** - callback processing from bitaps.com(bitcoin processor)
20. **bitaps_pays.sql** - an archive for all payments from bitaps.com
21. **bitaps_tmp.sql** - a temporal store of current invoices

22. **reedem.sql** - some encrypted active keys for bitaps.com

23. **rooms.sql** - actual video rooms(streams) at the moment for an output on to the main page of this site(those that publishing via mediasoup.js module)
24. **chat.sql** - chat history of messages
25. **session.sql** - user sessions. By application
