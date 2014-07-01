#!/usr/bin/python

import json
import os
import re

fnpattern = re.compile('[0-9]{3}-[^.]*')
testfiles = [fn for fn in os.listdir('.') if fnpattern.match(fn)]
with open('list.json', 'w') as f:
    f.write(json.dumps(testfiles))
