$(document).ready(function(){
  $("[data-location-group-id]").addClass('hidden');
  $("[data-resource]").change(function(){
    resource = $(this).data('resource');
    $('select[data-resource] option').removeClass('hidden');
    mountConflicts(this);
  });
});

function mountConflicts(select){
  errors = [];
  resource = $(select).data('resource');
  hideConflicts($(select).val(), resource); //hide my conflicts
  $("select[data-resource]:not('[data-resource=" + resource + "]')").each(function(){
    hideConflicts($(this).val(), $(this).data('resource')); //hide other conflicts
    checkHasParent(this, errors);
  });
  if(errors.length){ printErrors(errors, select); }
  if($('[data-resource="datacenter"]').val() == ""){
    $("[data-location-group-id]").addClass('hidden');
  }
}

function hideConflicts(value, resource){
  hash = resource === "datacenter" ? conflictHash.locationToPrice : conflictHash.priceToPrice;
  if(value && hash.hasOwnProperty(value)){
    hash[value].forEach(function(id){
      $('option[value="' + id + '"]').addClass('hidden');
    });
  }
}

function checkHasParent(select, errors){
  checked = $(select).find("option:checked");
  hasChecked = false;
  $(select).find("option:not('.hidden')").each(function(){
    if(checkParent(select, this, checked)){ hasChecked = true; }
  });
  if(!hasChecked){ buildErrors(select, errors, checked); }
}

function checkParent(select, option, checked){
  if($(option).data('item-description') === checked.data('item-description')){
    $(select).val($(option).val());
    return true;
  }
  return false;
}

function buildErrors(select, errors, checked){
  $(select).val('');
  errors.push(checked.text());
}

function printErrors(errors, select){
  message = "";
  errors.forEach(function(msg){
    message += "- " + msg + "<br>";
  });
  option_selected = $(select).find("option:checked").text();
  toastr.error(message, "Selecting " + option_selected + " removed the following selections:", {
    timeOut: '5000', closeButton: true, progressBar: true}
  );
}
