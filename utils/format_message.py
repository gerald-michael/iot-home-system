import json


def format_message(raw_data):
    parsed_data = json.loads(raw_data)['ops']
    message = ''
    current = ''
    for data in parsed_data:
        if(data['insert']):
            current = data['insert']
            if 'attributes' in data:
                attributes = data['attributes']
                if('bold' in attributes):
                    current = "*"+current+"*"
                if('italic' in attributes):
                    current = "_"+current+"_"
                if('strike' in attributes):
                    current = "~"+current+"~"
                if('link' in attributes):
                    current += " " + attributes['link']
                if('list' in attributes):
                    # TODO
                    pass
                    # if(attributes['list']=='bullet'):
                    #     current += "◆\t"
                    # if(attributes['list']=='ordered'):
                    #     count = count + 1
                    #     current += str(count).rstrip("\n") + " "+ current
            message += current
    return message
