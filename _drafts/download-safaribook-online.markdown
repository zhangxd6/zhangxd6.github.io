---
title: Download Safaribook online
date: 2018-06-09 22:27:00 -05:00
tags:
- books
- reading
---

https://github.com/ViciousPotato/safaribooks

This should work no matter platform you're on as no dependencies other than docker needs to be installed.

Run docker build -t safaribooks .

Run docker run -it --rm -v $(pwd)/converted:/app/converted safaribooks -u USER/EMAIL -p PASSWORD -b BOOK_ID download and wait for it to complete

The .epub and .mobi should now be in the folder converted of your current working directory.