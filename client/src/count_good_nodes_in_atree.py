# Definition for singly-linked list.
class ListNode(object):
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

    def __str__(self):
        return str(self.val) + "->" +  str(self.next) 

""" Convert a regular List to a ListNode linked list """
def list_to_listnode(lst):
    if not lst:
        return None
    head = ListNode(lst[0])
    current = head
    for value in lst[1:]:
        current.next = ListNode(value)
        current = current.next
    return head



def mergeTwoLists(list1, list2):
    result = ListNode() if list1 or list2 else None
    result_head = result 
    while list1 and list2: # Condition to check if both lists are not None
        if list1.val <= list2.val:
            result_val = list1.val
            list1 = list1.next

        elif list1.val > list2.val:
            result_val = list2.val
            list2 = list2.next

        if list1 and list2:
                result.next = ListNode(result_val) 
                result = result.next    
        else:
            result.next = None
            break


    remaining = list1 if list1 else list2
    if result:
        result.next = remaining
    if result_head:
        return result_head.next
    else:
        return None

print(mergeTwoLists(list_to_listnode([]), list_to_listnode([])))